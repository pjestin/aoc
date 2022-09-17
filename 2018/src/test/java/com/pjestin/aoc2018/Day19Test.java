package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day19Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day19", "input-test.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day19", "input.txt"));
  }

  @Test
  public void runInstructionsTest() {
    assertEquals(7, Day19.runInstructions(inputTestLines));
    assertEquals(1968, Day19.runInstructions(inputLines));
  }

  @Test
  public void findSumOfDivisorsTest() {
    assertEquals(1968, Day19.findSumOfDivisors(978));
    assertEquals(21211200, Day19.findSumOfDivisors(10551378));
  }
}
