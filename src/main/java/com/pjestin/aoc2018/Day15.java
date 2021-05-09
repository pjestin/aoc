package com.pjestin.aoc2018;

import java.util.List;
import java.util.OptionalInt;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Set;
import java.util.HashSet;
import java.util.TreeMap;
import java.util.stream.Collectors;
import com.pjestin.lib.Vector;

public class Day15 {
  private static class Unit {
    private static final int BASE_ATTACK_POINTS = 3;

    public Vector position;
    public int hp = 200;
    public boolean isElf;
    public int attackPoints;

    public static final Vector[] RANGE = { new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0), new Vector(0, 1) };

    public Unit(Vector position, boolean isElf, int elfBoost) {
      this.position = position;
      this.isElf = isElf;
      this.attackPoints = isElf ? BASE_ATTACK_POINTS + elfBoost : BASE_ATTACK_POINTS;
    }
  }

  private static Set<Vector> parseWalls(List<String> lines) {
    Set<Vector> walls = new HashSet<>();
    for (int y = 0; y < lines.size(); y++) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); x++) {
        if (line.charAt(x) == '#') {
          walls.add(new Vector(x, y));
        }
      }
    }
    return walls;
  }

  private static TreeMap<Vector, Unit> parseUnits(List<String> lines, int elfBoost) {
    TreeMap<Vector, Unit> units = new TreeMap<>();
    for (int y = 0; y < lines.size(); y++) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); x++) {
        char character = line.charAt(x);
        if (character == 'E' || character == 'G') {
          Vector position = new Vector(x, y);
          units.put(position, new Unit(position, character == 'E', elfBoost));
        }
      }
    }
    return units;
  }

  private static Unit getUnitInRange(Unit unit, TreeMap<Vector, Unit> units) {
    List<Unit> unitsInRange = new ArrayList<>();
    for (Vector direction : Unit.RANGE) {
      Vector rangePosition = new Vector(unit.position).add(direction);
      if (units.containsKey(rangePosition)) {
        Unit unitInRange = units.get(rangePosition);
        if (unitInRange.isElf != unit.isElf) {
          unitsInRange.add(unitInRange);
        }
      }
    }
    if (unitsInRange.isEmpty()) {
      return null;
    }
    Unit minHpUnit = null;
    int minHp = Integer.MAX_VALUE;
    for (Unit unitInRange : unitsInRange) {
      if (unitInRange.hp < minHp) {
        minHp = unitInRange.hp;
        minHpUnit = unitInRange;
      }
    }
    return minHpUnit;
  }

  private static class State {
    public Vector position;
    public LinkedList<Vector> path = new LinkedList<>();

    public State(Vector position) {
      this.position = position;
    }

    public State(State other) {
      this.position = other.position;
      this.path = (LinkedList<Vector>) other.path.clone();
    }
  }

  private static Set<Vector> getEnemyRanges(boolean shouldBeElf, TreeMap<Vector, Unit> units, Set<Vector> walls) {
    Set<Vector> enemyRanges = new HashSet<>();
    for (Unit potentialEnemy : units.values()) {
      if (potentialEnemy.isElf != shouldBeElf) {
        continue;
      }
      for (Vector direction : Unit.RANGE) {
        Vector position = new Vector(potentialEnemy.position).add(direction);
        if (!walls.contains(position) && !units.containsKey(position)) {
          enemyRanges.add(position);
        }
      }
    }
    return enemyRanges;
  }

  private static void moveUnit(Unit unit, TreeMap<Vector, Unit> units, Set<Vector> walls) {
    Unit potentialUnitInRange = getUnitInRange(unit, units);
    if (potentialUnitInRange != null) {
      return;
    }

    Set<Vector> enemyRanges = getEnemyRanges(!unit.isElf, units, walls);
    Set<Vector> visited = new HashSet<>();
    LinkedList<State> queue = new LinkedList<>();
    queue.add(new State(unit.position));
    while (!queue.isEmpty()) {
      State state = queue.pop();
      Vector position = state.position;
      if (walls.contains(position) || visited.contains(position)) {
        continue;
      }
      visited.add(position);
      if (enemyRanges.contains(position)) {
        units.remove(unit.position);
        unit.position = state.path.peek();
        units.put(unit.position, unit);
        return;
      } else if (!position.equals(unit.position) && units.containsKey(position)) {
        continue;
      }
      for (Vector direction : Unit.RANGE) {
        State nextState = new State(state);
        nextState.position = new Vector(position).add(direction);
        nextState.path.add(nextState.position);
        queue.add(nextState);
      }
    }
  }

  private static void attack(Unit unit, TreeMap<Vector, Unit> units) {
    Unit unitInRange = getUnitInRange(unit, units);
    if (unitInRange != null) {
      unitInRange.hp -= unit.attackPoints;
      if (unitInRange.hp <= 0) {
        units.remove(unitInRange.position);
      }
    }
  }

  private static OptionalInt getResult(TreeMap<Vector, Unit> units) {
    boolean onlyElves = true;
    boolean onlyGoblins = true;
    int totalHps = 0;
    for (Unit unit : units.values()) {
      onlyElves &= unit.isElf;
      onlyGoblins &= !unit.isElf;
      totalHps += unit.hp;
    }
    if (onlyElves || onlyGoblins) {
      return OptionalInt.of(totalHps);
    } else {
      return OptionalInt.empty();
    }
  }

  private static int playBattle(Set<Vector> walls, TreeMap<Vector, Unit> units) {
    int roundIndex = 0;
    while (true) {
      for (Unit unit : units.values().stream().collect(Collectors.toList())) {
        if (unit.hp <= 0) {
          continue;
        }
        OptionalInt result = getResult(units);
        if (result.isPresent()) {
          return result.getAsInt() * roundIndex;
        }
        moveUnit(unit, units, walls);
        attack(unit, units);
      }
      roundIndex++;
    }
  }

  public static int getBattleOutcome(List<String> lines) {
    Set<Vector> walls = parseWalls(lines);
    TreeMap<Vector, Unit> units = parseUnits(lines, 0);
    return playBattle(walls, units);
  }

  public static int getBattleOutcomeWithLowestBoost(List<String> lines) {
    Set<Vector> walls = parseWalls(lines);
    int boost = 1;
    int lastOutcome = 0;
    while (true) {
      TreeMap<Vector, Unit> units = parseUnits(lines, boost);
      int nbElvesInitial = (int) units.values().stream().filter(unit -> unit.isElf).count();
      lastOutcome = playBattle(walls, units);
      int nbElvesAfterBattle = (int) units.values().stream().filter(unit -> unit.isElf).count();
      if (nbElvesAfterBattle == nbElvesInitial) {
        break;
      }
      boost *= 2;
    }
    boost /= 2;
    int boostIncrement = boost;
    boolean lastResult = false;
    while (boostIncrement > 0) {
      boostIncrement /= 2;
      TreeMap<Vector, Unit> units = parseUnits(lines, boost);
      int nbElvesInitial = (int) units.values().stream().filter(unit -> unit.isElf).count();
      lastOutcome = playBattle(walls, units);
      int nbElvesAfterBattle = (int) units.values().stream().filter(unit -> unit.isElf).count();
      if (nbElvesAfterBattle == nbElvesInitial) {
        boost -= boostIncrement;
        lastResult = true;
      } else {
        boost += boostIncrement;
        lastResult = false;
      }
    }
    if (!lastResult) {
      boost++;
      TreeMap<Vector, Unit> units = parseUnits(lines, boost);
      lastOutcome = playBattle(walls, units);
    }
    return lastOutcome;
  }
}
