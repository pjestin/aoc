package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day25Test {
  private static List<String> inputTestLines, inputTest2Lines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day25", "input-test.txt"));
    inputTest2Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day25", "input-test-2.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day25", "input.txt"));
  }

  @Test
  public void findBattleOutcomeTest() {
    assertEquals(2, Day25.findNumberOfConstellations(inputTestLines));
    assertEquals(4, Day25.findNumberOfConstellations(inputTest2Lines));
    assertEquals(420, Day25.findNumberOfConstellations(inputLines));
  }
}
