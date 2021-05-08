package com.pjestin.aoc2018;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.stream.Collectors;

import com.pjestin.lib.Vector;

public class Day15 {
  private static final char WALL_CHARACTER = '#';
  private static final char ELF_CHARACTER = 'E';
  private static final char GOBLIN_CHARACTER = 'G';

  public static final Vector[] RANGE = { new Vector(0, -1), new Vector(-1, 0), new Vector(1, 0), new Vector(0, 1) };

  private static class Unit {
    public static final int ATTACK_POINTS = 3;

    public boolean isElf;
    public Vector position;
    public int hp = 200;

    public Unit(boolean isElf, Vector position) {
      this.isElf = isElf;
      this.position = position;
    }
  }

  private static class Battle {
    Set<Vector> walls;
    Map<Vector, Unit> units;

    public Battle(Set<Vector> walls, Map<Vector, Unit> units) {
      this.walls = walls;
      this.units = units;
    }

    public String toString() {
      Vector maxPosition = new Vector(0, 0);
      for (Vector wall : this.walls) {
        if (wall.x > maxPosition.x) {
          maxPosition.x = wall.x;
        }
        if (wall.y > maxPosition.y) {
          maxPosition.y = wall.y;
        }
      }
      StringBuilder sb = new StringBuilder();
      for (int y = 0; y <= maxPosition.y; ++y) {
        for (int x = 0; x <= maxPosition.x; ++x) {
          Vector position = new Vector(x, y);
          if (this.walls.contains(position)) {
            sb.append('#');
          } else if (this.units.containsKey(position)) {
            sb.append(this.units.get(position).isElf ? 'E' : 'G');
          } else {
            sb.append('.');
          }
        }
        sb.append('\n');
      }
      return sb.toString();
    }

    private Set<Vector> findTargetRanges(Unit unit) {
      // System.out.println("findTargetRanges");
      Set<Vector> targetRanges = new HashSet<>();
      List<Unit> targets = this.units.values().stream().filter(target -> target.isElf != unit.isElf)
          .collect(Collectors.toList());
      for (Unit target : targets) {
        for (Vector direction : RANGE) {
          Vector positionInRange = new Vector(target.position).add(direction);
          if (!this.units.containsKey(positionInRange) && !this.walls.contains(positionInRange)) {
            targetRanges.add(positionInRange);
          }
        }
      }
      return targetRanges;
    }

    private class QueueState implements Comparable<QueueState> {
      List<Vector> path;

      public QueueState(List<Vector> path) {
        this.path = path;
      }

      @Override
      public int compareTo(QueueState other) {
        if (this.path.size() == other.path.size()) {
          int lastPathCompare = this.path.get(this.path.size() - 1).compareTo(other.path.get(other.path.size() - 1));
          if (lastPathCompare == 0) {
            return this.path.get(0).compareTo(other.path.get(0));
          }
          return lastPathCompare;
        }
        return this.path.size() - other.path.size();
      }
    }

    private Vector findNextStep(Unit unit, Set<Vector> targetRanges) {
      // System.out.println("findNextStep");
      PriorityQueue<QueueState> queue = new PriorityQueue<>();
      queue.add(new QueueState(Arrays.asList(unit.position)));
      Set<Vector> visited = new HashSet<>();
      while (!queue.isEmpty()) {
        QueueState state = queue.remove();
        Vector position = state.path.get(state.path.size() - 1);
        if (this.walls.contains(position) || (this.units.containsKey(position) && !unit.position.equals(position))
            || visited.contains(position)) {
          continue;
        }
        visited.add(position);
        if (targetRanges.contains(position)) {
          // Found shortest path, returning 2nd path position, which is next step
          return state.path.get(1);
        }
        for (Vector direction : RANGE) {
          List<Vector> pathCopy = state.path.stream().collect(Collectors.toList());
          Vector nextPosition = new Vector(position).add(direction);
          pathCopy.add(nextPosition);
          queue.add(new QueueState(pathCopy));
        }
      }
      return null;
    }

    private void move(Unit unit) {
      // System.out.println("move");
      for (Vector direction : RANGE) {
        Vector target = new Vector(unit.position).add(direction);
        if (this.units.containsKey(target) && this.units.get(target).isElf != unit.isElf) {
          // Unit is next to enemy target, no need to move
          return;
        }
      }
      Set<Vector> targetRanges = this.findTargetRanges(unit);
      // System.out.println(String.format("Unit at position %s; target ranges: %s",
      // unit.position, targetRanges));
      if (targetRanges.isEmpty()) {
        // No enemy has accessible square in range
        return;
      }
      Vector nextStep = this.findNextStep(unit, targetRanges);
      if (nextStep == null) {
        // No path to target ranges
        return;
      }
      this.units.remove(unit.position);
      unit.position = nextStep;
      this.units.put(nextStep, unit);
    }

    public void attack(Unit unit) {
      // System.out.println("attack");
      // System.out.println(String.format("Unit position: %s", unit.position));
      List<Unit> unitsInRange = new ArrayList<>();
      for (Vector direction : RANGE) {
        Vector rangePosition = new Vector(unit.position).add(direction);
        if (this.units.containsKey(rangePosition)) {
          Unit rangeUnit = this.units.get(rangePosition);
          if (rangeUnit.isElf != unit.isElf) {
            unitsInRange.add(rangeUnit);
          }
        }
      }
      if (unitsInRange.isEmpty()) {
        return;
      }
      unitsInRange.sort((unit1, unit2) -> {
        if (unit1.hp == unit2.hp) {
          return unit1.position.compareTo(unit2.position);
        }
        return unit1.hp - unit2.hp;
      });
      Unit target = unitsInRange.get(0);
      target.hp -= Unit.ATTACK_POINTS;
      if (target.hp <= 0) {
        this.units.remove(target.position);
      }
    }

    public boolean playTurn() {
      // System.out.println("playTurn");
      List<Unit> unitList = this.units.values().stream().collect(Collectors.toList());
      unitList.sort((unit1, unit2) -> unit1.position.compareTo(unit2.position));
      for (Unit unit : unitList) {
        // System.out.println(String.format("Unit position: %s", unit.position));
        if (unit.hp <= 0) {
          continue;
        }

        if (this.units.values().stream().filter(target -> target.isElf != unit.isElf).count() == 0) {
          // No targets left
          return false;
        }

        // Move phase
        this.move(unit);

        // Attack phase
        this.attack(unit);
      }
      return true;
    }

    public int outcome() {
      return this.units.values().stream().map(unit -> unit.hp).reduce(0, Integer::sum);
    }
  }

  public static Battle parseWallsAndUnits(List<String> lines) {
    // System.out.println("parseWallsAndUnits");
    Set<Vector> walls = new HashSet<>();
    Map<Vector, Unit> units = new HashMap<>();
    for (int y = 0; y < lines.size(); ++y) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); ++x) {
        char character = line.charAt(x);
        switch (character) {
          case WALL_CHARACTER:
            walls.add(new Vector(x, y));
            break;
          case ELF_CHARACTER:
          case GOBLIN_CHARACTER:
            Vector position = new Vector(x, y);
            units.put(position, new Unit(character == ELF_CHARACTER, position));
            break;
        }
      }
    }
    return new Battle(walls, units);
  }

  public static int getBattleOutcome(List<String> lines) {
    // System.out.println("getBattleOutcome");
    Battle battle = parseWallsAndUnits(lines);
    // System.out.println(battle);
    // int nbElves = (int) battle.units.values().stream().filter(unit ->
    // unit.isElf).count();
    // int nbGoblins = (int) battle.units.values().stream().filter(unit ->
    // !unit.isElf).count();
    // System.out.println(String.format("Number of elves: %d; number of goblins:
    // %d", nbElves, nbGoblins));
    int roundCount = 0;
    while (true) {
      boolean targetsExist = battle.playTurn();
      // System.out.println(battle);
      // battle.playTurn();
      // nbElves = (int) battle.units.values().stream().filter(unit ->
      // unit.isElf).count();
      // nbGoblins = (int) battle.units.values().stream().filter(unit ->
      // !unit.isElf).count();
      // System.out.println(String.format("Number of elves: %d; number of goblins:
      // %d", nbElves, nbGoblins));
      if (!targetsExist) {
        break;
      }
      roundCount++;
    }
    return roundCount * battle.outcome();
  }
}
