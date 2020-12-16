package com.pjestin.aoc2018;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.stream.Collectors;
import static java.lang.Integer.parseInt;

public class Day10 {
  private static class Star {
    public int x;
    public int y;
    public int dx;
    public int dy;

    public Star(int x, int y, int dx, int dy) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
    }

    private static final String PATTERN = "^position=< ?(-?\\d+),  ?(-?\\d+)> velocity=< ?(-?\\d+),  ?(-?\\d+)>$";

    public static Star parse(String line) {
      Pattern pattern = Pattern.compile(PATTERN);
      Matcher matcher = pattern.matcher(line);
      matcher.find();
      int x = parseInt(matcher.group(1));
      int y = parseInt(matcher.group(2));
      int dx = parseInt(matcher.group(3));
      int dy = parseInt(matcher.group(4));
      return new Star(x, y, dx, dy);
    }

    public void advance(int steps) {
      x += steps * dx;
      y += steps * dy;
    }
  }

  private static List<Star> parseStars(List<String> lines) {
    return lines.stream().map(Star::parse).collect(Collectors.toList());
  }

  private static void advanceStars(List<Star> stars, int step) {
    stars.parallelStream().forEach(star -> star.advance(step));
  }

  private static double getVariance(List<Star> stars) {
    double avgX = stars.parallelStream().map(star -> star.x).reduce(0, Integer::sum) / (double)stars.size();
    double avgY = stars.parallelStream().map(star -> star.y).reduce(0, Integer::sum) / (double)stars.size();
    double varX = stars.parallelStream().map(star -> Math.pow(star.x - avgX, 2)).reduce(0.0, Double::sum) / (double)stars.size();
    double varY = stars.parallelStream().map(star -> Math.pow(star.y - avgY, 2)).reduce(0.0, Double::sum) / (double)stars.size();
    return varX + varY;
  }

  private static boolean isVarianceIncreasing(List<Star> stars) {
    double variance = getVariance(stars);
    advanceStars(stars, 1);
    double nextVariance = getVariance(stars);
    advanceStars(stars, -1);
    return nextVariance > variance;
  }

  public static int getMinVarianceStarConfigTime(List<String> lines) {
    List<Star> stars = parseStars(lines);
    int time = 0;
    int step = 1;
    while (true) {
      advanceStars(stars, step);
      time += step;
      if (isVarianceIncreasing(stars)) {
        break;
      }
      step *= 2;
    }
    while (true) {
      step /= 2;
      if (step == 1) {
        break;
      }
      if (isVarianceIncreasing(stars)) {
        advanceStars(stars, -step);
        time -= step;
      } else {
        advanceStars(stars, step);
        time += step;
      }
    }
    advanceStars(stars, -1);
    if (isVarianceIncreasing(stars)) {
      return time - 1;
    } else {
      return time;
    }
  }

  public static String displayStarMessage(List<String> lines) {
    int minVarianceTime = getMinVarianceStarConfigTime(lines);
    List<Star> stars = parseStars(lines);
    advanceStars(stars, minVarianceTime);
    int minX = stars.parallelStream().map(star -> star.x).min(Integer::compare).get();
    int maxX = stars.parallelStream().map(star -> star.x).max(Integer::compare).get();
    int minY = stars.parallelStream().map(star -> star.y).min(Integer::compare).get();
    int maxY = stars.parallelStream().map(star -> star.y).max(Integer::compare).get();
    StringBuilder sb = new StringBuilder();
    for (int y = minY; y <= maxY; y++) {
      for (int x = minX; x <= maxX; x++) {
        sb.append(".");
      }
      sb.append("\n");
    }
    for (Star star : stars) {
      int index = (star.y - minY) * (maxX - minX + 2) + star.x - minX;
      sb.replace(index, index + 1, "#");
    }
    return sb.toString();
  }
}
