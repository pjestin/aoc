package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day17Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day17", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day17", "input.txt"));
  }

  @Test
  public void countWaterReachableTilesTest() {
    assertEquals(57, Day17.countWaterReachableTiles(inputTestLines));
    assertEquals(31934, Day17.countWaterReachableTiles(inputLines));
  }

  @Test
  public void countPersistingWaterTilesTest() {
    assertEquals(29, Day17.countPersistingWaterTiles(inputTestLines));
    assertEquals(24790, Day17.countPersistingWaterTiles(inputLines));
  }
}
