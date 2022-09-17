package com.pjestin.aoc2018;

import java.util.HashSet;
import java.util.Set;

public class Day21 {
  private static int runProgramLoop(int value) {
    int acc = value | 65536;
    value = 12772194;
    while (acc > 0) {
      value = (((value + (acc & 255)) & 16777215) * 65899) & 16777215;
      acc = acc >>> 8;
    }
    return value;
  }

  public static int runProgramLoopOnce() {
    return runProgramLoop(0);
  }

  public static int findProgramLastNonRepeatingValue() {
    Set<Integer> visitedValues = new HashSet<>();
    int value = 0;
    int previousValue = 0;
    while (!visitedValues.contains(value)) {
      visitedValues.add(value);
      previousValue = value;
      value = runProgramLoop(value);
    }
    return previousValue;
  }
}
