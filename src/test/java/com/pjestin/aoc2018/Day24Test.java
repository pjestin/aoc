package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day24Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day24", "input-test.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day24", "input.txt"));
  }

  @Test
  public void findBattleOutcomeTest() {
    assertEquals(5216, Day24.findBattleOutcome(inputTestLines));
    assertEquals(21127, Day24.findBattleOutcome(inputLines));
  }
}
