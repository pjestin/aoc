package com.pjestin.aoc2018;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.pjestin.lib.Vector;

public class Day25 {
  private static List<Vector> parsePoints(List<String> lines) {
    return lines.stream().map(line -> {
      String[] splitLine = line.split(",");
      int x = Integer.parseInt(splitLine[0]);
      int y = Integer.parseInt(splitLine[1]);
      int z = Integer.parseInt(splitLine[2]);
      int w = Integer.parseInt(splitLine[3]);
      return new Vector(x, y, z, w);
    }).collect(Collectors.toList());
  }

  private static List<Vector> findConnectedPoints(Vector point, List<Vector> points) {
    return points.stream().filter(otherPoint -> point.distance(otherPoint) <= 3).collect(Collectors.toList());
  }

  private static void visitContellationPoint(Vector constellationPoint, List<Vector> points, Set<Vector> visited) {
    if (visited.contains(constellationPoint)) {
      return;
    }
    visited.add(constellationPoint);
    for (Vector connectedPoint : findConnectedPoints(constellationPoint, points)) {
      visitContellationPoint(connectedPoint, points, visited);
    }
  }

  public static int findNumberOfConstellations(List<String> lines) {
    List<Vector> points = parsePoints(lines);
    Set<Vector> visited = new HashSet<>();
    int constellationCount = 0;
    for (Vector point : points) {
      if (visited.contains(point)) {
        continue;
      }
      ++constellationCount;
      visitContellationPoint(point, points, visited);
    }
    return constellationCount;
  }
}
