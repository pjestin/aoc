package com.pjestin.aoc2018;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static java.lang.Integer.parseInt;

public class Day23 {
  private static class Vector3D {
    public int x;
    public int y;
    public int z;

    public Vector3D(int x, int y, int z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }

    public Vector3D(Vector3D other) {
      this.x = other.x;
      this.y = other.y;
      this.z = other.z;
    }

    public int distance(Vector3D other) {
      return Math.abs(other.x - this.x) + Math.abs(other.y - this.y) + Math.abs(other.z - this.z);
    }

    public Vector3D add(Vector3D other) {
      this.x += other.x;
      this.y += other.y;
      this.z += other.z;
      return this;
    }

    @Override
    public int hashCode() {
      return 1412597 * y + 1237 * x + 7561 * z;
    }

    @Override
    public boolean equals(Object obj) {
      return obj instanceof Vector3D && obj.hashCode() == hashCode();
    }

    @Override
    public String toString() {
      return String.format("%d,%d;%d", x, y, z);
    }
  }

  private static class Nanobot {
    public Vector3D position;
    public int radius;

    public Nanobot(Vector3D position, int radius) {
      this.position = position;
      this.radius = radius;
    }

    public boolean isInRange(Vector3D position) {
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
      return new Nanobot(new Vector3D(x, y, z), r);
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

  private static int countNanobotsWherePositionInRange(List<Nanobot> nanobots, Vector3D position) {
    return (int) nanobots.stream().filter(nanobot -> nanobot.isInRange(position)).count();
  }

  private static final Vector3D[] NEIGHBOURS = new Vector3D[] { new Vector3D(1, 0, 0), new Vector3D(-1, 0, 0),
      new Vector3D(0, 1, 0), new Vector3D(0, -1, 0), new Vector3D(0, 0, 1), new Vector3D(0, 0, -1) };

  private static final int MARGIN_OF_ERROR = 2;
  private static final int DILATION_FACTOR_START = 43046721; // 3^16
  private static final int DILATION_FACTOR_DECREMENT = 3;

  private static Vector3D findBestDilatedCoordinates(List<Nanobot> nanobots, int dilationFactor, Vector3D minPosition,
      Vector3D maxPosition) {
    Vector3D maxRangeCountPosition = null;
    int maxRangeCount = 0;

    Set<Vector3D> visited = new HashSet<>();
    LinkedList<Vector3D> queue = new LinkedList<>();
    queue.add(minPosition);
    while (!queue.isEmpty()) {
      Vector3D position = queue.removeFirst();
      if (visited.contains(position)) {
        continue;
      }
      visited.add(position);
      int rangeCount = countNanobotsWherePositionInRange(nanobots, position);
      if (rangeCount > maxRangeCount) {
        maxRangeCount = rangeCount;
        maxRangeCountPosition = position;
      }
      for (Vector3D immediateNeighbour : NEIGHBOURS) {
        Vector3D dilatedNeighbour = new Vector3D(dilationFactor * immediateNeighbour.x,
            dilationFactor * immediateNeighbour.y, dilationFactor * immediateNeighbour.z);
        Vector3D neighbourPosition = new Vector3D(position).add(dilatedNeighbour);
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
    Vector3D minPosition = new Vector3D(minX, minY, minZ);
    Vector3D maxPosition = new Vector3D(maxX, maxY, maxZ);

    Vector3D maxRangeCountPosition = null;
    for (int dilationFactor = DILATION_FACTOR_START; dilationFactor > 0; dilationFactor /= DILATION_FACTOR_DECREMENT) {
      maxRangeCountPosition = findBestDilatedCoordinates(nanobots, dilationFactor, minPosition, maxPosition);
      minPosition = new Vector3D(maxRangeCountPosition).add(new Vector3D(-dilationFactor * MARGIN_OF_ERROR,
          -dilationFactor * MARGIN_OF_ERROR, -dilationFactor * MARGIN_OF_ERROR));
      maxPosition = new Vector3D(maxRangeCountPosition).add(new Vector3D(dilationFactor * MARGIN_OF_ERROR,
          dilationFactor * MARGIN_OF_ERROR, dilationFactor * MARGIN_OF_ERROR));
    }

    return maxRangeCountPosition.distance(new Vector3D(0, 0, 0));
  }
}
