package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day15Test {
  private static List<String> inputTestLines, inputTest2Lines, inputTest3Lines, inputTest4Lines, inputTest5Lines, inputTest6Lines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test.txt"));
    inputTest2Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test-2.txt"));
    inputTest3Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test-3.txt"));
    inputTest4Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test-4.txt"));
    inputTest5Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test-5.txt"));
    inputTest6Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input-test-6.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day15", "input.txt"));
  }

  @Test
  public void getBattleOutcomeTest() {
    assertEquals(27730, Day15.getBattleOutcome(inputTestLines));
    // assertEquals(36334, Day15.getBattleOutcome(inputTest2Lines));
    // assertEquals(39514, Day15.getBattleOutcome(inputTest3Lines));
    // assertEquals(27755, Day15.getBattleOutcome(inputTest4Lines));
    // assertEquals(28944, Day15.getBattleOutcome(inputTest5Lines));
    // assertEquals(18740, Day15.getBattleOutcome(inputTest6Lines));
    // assertEquals(1, Day15.getBattleOutcome(inputLines));
  }
}

// 259776 too low
// 259875 too low
// 262400 too high
// 260073 incorrect
// 260370 incorrect
