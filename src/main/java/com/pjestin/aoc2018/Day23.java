package com.pjestin.aoc2018;

import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Integer.parseInt;

public class Day23 {
  private static class Nanobot {
    public int x;
    public int y;
    public int z;
    public int r;

    public Nanobot(int x, int y, int z, int r) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.r = r;
    }

    public int distance(Nanobot other) {
      return Math.abs(other.x - this.x) + Math.abs(other.y - this.y) + Math.abs(other.z - this.z);
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
      return new Nanobot(x, y, z, r);
    }).collect(Collectors.toList());
  }

  private static Nanobot findStrongestNanobot(List<Nanobot> nanobots) {
    return nanobots.stream().max((n1, n2) -> n1.r - n2.r).get();
  }

  private static int countNanobotsInRange(List<Nanobot> nanobots, Nanobot reference) {
    return (int) nanobots.stream().filter(nanobot -> reference.distance(nanobot) <= reference.r).count();
  }

  public static int findNanobotsInRangeOfStrongest(List<String> lines) {
    List<Nanobot> nanobots = parseNanobots(lines);
    Nanobot strongestNanobot = findStrongestNanobot(nanobots);
    return countNanobotsInRange(nanobots, strongestNanobot);
  }
}
