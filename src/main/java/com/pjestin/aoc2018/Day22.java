package com.pjestin.aoc2018;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import com.pjestin.lib.Vector;

import static java.lang.Integer.parseInt;

public class Day22 {
  private static final int EROSION_LEVEL_CONGRUENCE = 20183;
  private static final int X_GEOLOGIC_FACTOR = 16807;
  private static final int Y_GEOLOGIC_FACTOR = 48271;

  private static final Vector[] NEIGHBOUR_POSITIONS = new Vector[] { new Vector(-1, 0), new Vector(1, 0),
      new Vector(0, 1), new Vector(0, -1) };

  private static int parseDepth(String line) {
    return parseInt(line.split(" ")[1]);
  }

  private static Vector parseTarget(String line) {
    String coordinates = line.split(" ")[1];
    String[] splitCoordinates = coordinates.split(",");
    int x = parseInt(splitCoordinates[0]);
    int y = parseInt(splitCoordinates[1]);
    return new Vector(x, y);
  }

  private static void updateErosionLevel(Vector position, Map<Vector, Integer> erosionLevelMap, Vector target,
      int depth) {
    int geologicIndex = 0;
    if (target.equals(position)) {
      geologicIndex = 0;
    } else if (position.x == 0) {
      geologicIndex = position.y * Y_GEOLOGIC_FACTOR;
    } else if (position.y == 0) {
      geologicIndex = position.x * X_GEOLOGIC_FACTOR;
    } else {
      geologicIndex = erosionLevelMap.get(new Vector(-1, 0).add(position))
          * erosionLevelMap.get(new Vector(0, -1).add(position));
    }
    erosionLevelMap.put(position, (geologicIndex + depth) % EROSION_LEVEL_CONGRUENCE);
  }

  private static Map<Vector, Integer> buildTypeMap(int depth, Vector target, int xSize, int ySize) {
    Map<Vector, Integer> typeMap = new HashMap<>();
    Map<Vector, Integer> erosionLevelMap = new HashMap<>();
    for (int x = 0; x <= xSize; ++x) {
      for (int y = 0; y <= ySize; ++y) {
        Vector position = new Vector(x, y);
        updateErosionLevel(position, erosionLevelMap, target, depth);
        typeMap.put(position, erosionLevelMap.get(new Vector(x, y)) % 3);
      }
    }
    return typeMap;
  }

  public static int findRiskLevel(List<String> lines) {
    int depth = parseDepth(lines.get(0));
    Vector target = parseTarget(lines.get(1));
    Map<Vector, Integer> typeMap = buildTypeMap(depth, target, target.x + 1, target.y + 1);
    int riskLevel = 0;
    for (int x = 0; x <= target.x; ++x) {
      for (int y = 0; y <= target.y; ++y) {
        riskLevel += typeMap.get(new Vector(x, y));
      }
    }
    return riskLevel;
  }

  private static class QueueState {
    Vector position;
    int time;
    int gear;
    // Neither: 0
    // Torch: 1
    // Cimbing gear: 2

    public QueueState(Vector position, int time, int gear) {
      this.position = position;
      this.time = time;
      this.gear = gear;
    }

    public String toString() {
      return String.format("position=%s time=%d gear=%d", this.position, this.time, this.gear);
    }
  }

  private static String getStateHash(Vector position, int gear) {
    return String.format("%s;%d", position, gear);
  }

  public static int findPathToTarget(List<String> lines) {
    int depth = parseDepth(lines.get(0));
    Vector target = parseTarget(lines.get(1));
    int xMax = 7 * target.x;
    int yMax = 7 * target.y;
    Map<Vector, Integer> typeMap = buildTypeMap(depth, target, xMax, yMax);
    LinkedList<QueueState> queue = new LinkedList<>();
    queue.add(new QueueState(new Vector(0, 0), 0, 1));
    Map<String, Integer> timeMap = new HashMap<>();
    while (!queue.isEmpty()) {
      QueueState state = queue.removeFirst();
      String stateHash = getStateHash(state.position, state.gear);
      if (timeMap.containsKey(stateHash) && state.time >= timeMap.get(stateHash)) {
        continue;
      }
      timeMap.put(stateHash, state.time);
      if (target.equals(state.position)) {
        if (state.gear != 1) {
          queue.addLast(new QueueState(state.position, state.time + 7, 1));
        }
        continue;
      }
      int type = typeMap.get(state.position);
      for (Vector neighbour : NEIGHBOUR_POSITIONS) {
        Vector neighbourPosition = new Vector(state.position).add(neighbour);
        if (neighbourPosition.x < 0 || neighbourPosition.x > xMax || neighbourPosition.y < 0
            || neighbourPosition.y > yMax) {
          continue;
        }
        int neighbourType = typeMap.get(neighbourPosition);
        if (neighbourType != state.gear) {
          queue.addLast(new QueueState(neighbourPosition, state.time + 1, state.gear));
        } else {
          int newGear = 3 - (neighbourType + type);
          queue.addLast(new QueueState(neighbourPosition, state.time + 8, newGear));
        }
      }
    }
    return timeMap.get(getStateHash(target, 1));
  }
}
