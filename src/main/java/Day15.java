import java.util.List;
import java.util.OptionalInt;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Set;
import java.util.HashSet;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Day15 {
  private static class Unit {
    public Vector position;
    public int hp = 200;
    public boolean isElf;

    public static final int ATTACK_POINTS = 3;

    public static final Vector[] RANGE = {new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0), new Vector(0, 1)};

    public Unit(Vector position, boolean isElf) {
      this.position = position;
      this.isElf = isElf;
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

  private static TreeMap<Vector, Unit> parseUnits(List<String> lines) {
    TreeMap<Vector, Unit> units = new TreeMap<>();
    for (int y = 0; y < lines.size(); y++) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); x++) {
        if (line.charAt(x) == 'E' || line.charAt(x) == 'G') {
          Vector position = new Vector(x, y);
          units.put(position, new Unit(position, line.charAt(x) == 'E'));
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
      this.path = (LinkedList<Vector>)other.path.clone();
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

    System.out.println(String.format("Moving unit at %s", unit.position));
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
      // System.out.println(String.format("At %s", position));
      visited.add(position);
      if (enemyRanges.contains(position)) {
        System.out.println(String.format("Found enemy range at %s, moving to %s", position, state.path.peek()));
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
      System.out.println(String.format("Attacking %s with unit at %s", unitInRange.position, unit.position));
      unitInRange.hp -= Unit.ATTACK_POINTS;
      if (unitInRange.hp <= 0) {
        System.out.println("They died!");
        units.remove(unitInRange.position);
      }
    }
  }

  private static OptionalInt getResult(TreeMap<Vector, Unit> units) {
    boolean onlyElves = true;
    boolean onlyGoblins = true;
    int totalHps = 0;
    for (Unit unit : units.values()) {
      System.out.println(String.format("position: %s; HP: %d; isElf? %b", unit.position, unit.hp, unit.isElf));
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

  public static int getBattleOutcome(List<String> lines) {
    Set<Vector> walls = parseWalls(lines);
    TreeMap<Vector, Unit> units = parseUnits(lines);
    int roundIndex = 0;
    while (true) {
      System.out.println(String.format("Round %d", roundIndex));
      for (Unit unit : units.values().stream().collect(Collectors.toList())) {
        OptionalInt result = getResult(units);
        if (result.isPresent()) {
          System.out.println(String.format("Battle ended, last completed round: %d, total remaining HP: %d", roundIndex, result.getAsInt()));
          return result.getAsInt() * roundIndex;
        }
        moveUnit(unit, units, walls);
        attack(unit, units);
      }
      roundIndex++;
    }
  }
}
