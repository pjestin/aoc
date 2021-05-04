package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day18Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day18", "input-test.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day18", "input.txt"));
  }

  @Test
  public void countWoodedAndLumberyardAcresPart1Test() {
    assertEquals(1147, Day18.countWoodedAndLumberyardAcres(inputTestLines, 10));
    assertEquals(539682, Day18.countWoodedAndLumberyardAcres(inputLines, 10));
  }

  @Test
  public void countWoodedAndLumberyardAcresPart2Test() {
    assertEquals(0, Day18.countWoodedAndLumberyardAcres(inputTestLines, 1000000000));
    assertEquals(226450, Day18.countWoodedAndLumberyardAcres(inputLines, 1000000000));
  }
}
