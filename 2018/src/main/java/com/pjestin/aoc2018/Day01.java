package com.pjestin.aoc2018;

import java.util.List;
import java.lang.Integer;
import java.util.Set;
import java.util.HashSet;

public class Day01 {
  public static int getFrequency(List<String> lines) {
    return lines.stream().map(Integer::parseInt).reduce(0, Integer::sum);
  }

  public static Integer getFirstReoccurringFrequency(List<String> lines) {
    Set<Integer> frequencies = new HashSet<>();
    int frequency = 0;
    while (true) {
      for (String line : lines) {
        frequency += Integer.parseInt(line);
        if (frequencies.contains(frequency)) {
          return frequency;
        }
        frequencies.add(frequency);
      }
    }
  }
}
