package com.pjestin.aoc2018;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.pjestin.lib.Vector;

import static java.lang.Integer.parseInt;

public class Day22 {
  private static final int EROSION_LEVEL_CONGRUENCE = 20183;
  private static final int X_GEOLOGIC_FACTOR = 16807;
  private static final int Y_GEOLOGIC_FACTOR = 48271;
  private static final int TYPE_CONGRUENCE = 3;

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

  private static Map<Vector, Integer> buildErosionLevelMap(int depth, Vector target) {
    Map<Vector, Integer> erosionLevelMap = new HashMap<>();
    for (int x = 0; x <= target.x; ++x) {
      for (int y = 0; y <= target.y; ++y) {
        updateErosionLevel(new Vector(x, y), erosionLevelMap, target, depth);
      }
    }
    return erosionLevelMap;
  }

  public static int findRiskLevel(List<String> lines) {
    int depth = parseDepth(lines.get(0));
    Vector target = parseTarget(lines.get(1));
    Map<Vector, Integer> erosionLevelMap = buildErosionLevelMap(depth, target);
    int riskLevel = 0;
    for (int x = 0; x <= target.x; ++x) {
      for (int y = 0; y <= target.y; ++y) {
        riskLevel += erosionLevelMap.get(new Vector(x, y)) % TYPE_CONGRUENCE;
      }
    }
    return riskLevel;
  }
}
