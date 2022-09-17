package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day23Test {
  private static List<String> inputTestLines, inputTest2Lines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day23", "input-test.txt"));
    inputTest2Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day23", "input-test-2.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day23", "input.txt"));
  }

  @Test
  public void findNanobotsInRangeOfStrongestTest() {
    assertEquals(7, Day23.findNanobotsInRangeOfStrongest(inputTestLines));
    assertEquals(219, Day23.findNanobotsInRangeOfStrongest(inputLines));
  }

  @Test
  public void findBestCoordinatesTest() {
    assertEquals(1, Day23.findBestCoordinates(inputTestLines));
    assertEquals(36, Day23.findBestCoordinates(inputTest2Lines));
    assertEquals(83779034, Day23.findBestCoordinates(inputLines));
  }
}
