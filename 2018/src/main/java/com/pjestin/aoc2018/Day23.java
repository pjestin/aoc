package com.pjestin.aoc2018;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.pjestin.lib.Vector;

import static java.lang.Integer.parseInt;

public class Day23 {
  private static class Nanobot {
    public Vector position;
    public int radius;

    public Nanobot(Vector position, int radius) {
      this.position = position;
      this.radius = radius;
    }

    public boolean isInRange(Vector position) {
      return this.position.distance(position) <= this.radius;
    }
  }

  private static List<Nanobot> parseNanobots(List<String> lines) {
    return lines.stream().map(line -> {
      String[] splitLine = line.split(", ");
      String positionString = splitLine[0];
      String[] splitPositionString = positionString.split(",");
      int x = parseInt(splitPositionString[0].split("<")[1]);
      int y = parseInt(splitPositionString[1]);
      int z = parseInt(splitPositionString[2].split(">")[0]);
      String radiusString = splitLine[1];
      int r = parseInt(radiusString.split("=")[1]);
      return new Nanobot(new Vector(x, y, z), r);
    }).collect(Collectors.toList());
  }

  private static Nanobot findStrongestNanobot(List<Nanobot> nanobots) {
    return nanobots.stream().max((n1, n2) -> n1.radius - n2.radius).get();
  }

  private static int countNanobotsInRange(List<Nanobot> nanobots, Nanobot reference) {
    return (int) nanobots.stream().filter(nanobot -> reference.isInRange(nanobot.position)).count();
  }

  public static int findNanobotsInRangeOfStrongest(List<String> lines) {
    List<Nanobot> nanobots = parseNanobots(lines);
    Nanobot strongestNanobot = findStrongestNanobot(nanobots);
    return countNanobotsInRange(nanobots, strongestNanobot);
  }

  private static int countNanobotsWherePositionInRange(List<Nanobot> nanobots, Vector position) {
    return (int) nanobots.stream().filter(nanobot -> nanobot.isInRange(position)).count();
  }

  private static final Vector[] NEIGHBOURS = new Vector[] { new Vector(1, 0, 0), new Vector(-1, 0, 0),
      new Vector(0, 1, 0), new Vector(0, -1, 0), new Vector(0, 0, 1), new Vector(0, 0, -1) };

  private static final int MARGIN_OF_ERROR = 2;
  private static final int DILATION_FACTOR_START = 43046721; // 3^16
  private static final int DILATION_FACTOR_DECREMENT = 3;

  private static Vector findBestDilatedCoordinates(List<Nanobot> nanobots, int dilationFactor, Vector minPosition,
      Vector maxPosition) {
    Vector maxRangeCountPosition = null;
    int maxRangeCount = 0;

    Set<Vector> visited = new HashSet<>();
    LinkedList<Vector> queue = new LinkedList<>();
    queue.add(minPosition);
    while (!queue.isEmpty()) {
      Vector position = queue.removeFirst();
      if (visited.contains(position)) {
        continue;
      }
      visited.add(position);
      int rangeCount = countNanobotsWherePositionInRange(nanobots, position);
      if (rangeCount > maxRangeCount) {
        maxRangeCount = rangeCount;
        maxRangeCountPosition = position;
      }
      for (Vector immediateNeighbour : NEIGHBOURS) {
        Vector dilatedNeighbour = new Vector(dilationFactor * immediateNeighbour.x,
            dilationFactor * immediateNeighbour.y, dilationFactor * immediateNeighbour.z);
        Vector neighbourPosition = new Vector(position).add(dilatedNeighbour);
        if (neighbourPosition.x >= minPosition.x && neighbourPosition.x <= maxPosition.x
            && neighbourPosition.y >= minPosition.y && neighbourPosition.y <= maxPosition.y
            && neighbourPosition.z >= minPosition.z && neighbourPosition.z <= maxPosition.z) {
          queue.addLast(neighbourPosition);
        }
      }
    }
    return maxRangeCountPosition;
  }

  public static int findBestCoordinates(List<String> lines) {
    List<Nanobot> nanobots = parseNanobots(lines);

    int minX = nanobots.stream().map(nanobot -> nanobot.position.x).min((x1, x2) -> x1 - x2).get();
    int maxX = nanobots.stream().map(nanobot -> nanobot.position.x).max((x1, x2) -> x1 - x2).get();
    int minY = nanobots.stream().map(nanobot -> nanobot.position.y).min((y1, y2) -> y1 - y2).get();
    int maxY = nanobots.stream().map(nanobot -> nanobot.position.y).max((y1, y2) -> y1 - y2).get();
    int minZ = nanobots.stream().map(nanobot -> nanobot.position.z).min((z1, z2) -> z1 - z2).get();
    int maxZ = nanobots.stream().map(nanobot -> nanobot.position.z).max((z1, z2) -> z1 - z2).get();
    Vector minPosition = new Vector(minX, minY, minZ);
    Vector maxPosition = new Vector(maxX, maxY, maxZ);

    Vector maxRangeCountPosition = null;
    for (int dilationFactor = DILATION_FACTOR_START; dilationFactor > 0; dilationFactor /= DILATION_FACTOR_DECREMENT) {
      maxRangeCountPosition = findBestDilatedCoordinates(nanobots, dilationFactor, minPosition, maxPosition);
      minPosition = new Vector(maxRangeCountPosition).add(new Vector(-dilationFactor * MARGIN_OF_ERROR,
          -dilationFactor * MARGIN_OF_ERROR, -dilationFactor * MARGIN_OF_ERROR));
      maxPosition = new Vector(maxRangeCountPosition).add(new Vector(dilationFactor * MARGIN_OF_ERROR,
          dilationFactor * MARGIN_OF_ERROR, dilationFactor * MARGIN_OF_ERROR));
    }

    return maxRangeCountPosition.distance(new Vector(0, 0, 0));
  }
}
