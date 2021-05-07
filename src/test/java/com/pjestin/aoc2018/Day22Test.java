package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day22Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day22", "input-test.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day22", "input.txt"));
  }

  @Test
  public void findRiskLevelTest() {
    assertEquals(114, Day22.findRiskLevel(inputTestLines));
    assertEquals(5637, Day22.findRiskLevel(inputLines));
  }

  @Test
  public void findPathToTargetTest() {
    assertEquals(45, Day22.findPathToTarget(inputTestLines));
    assertEquals(969, Day22.findPathToTarget(inputLines));
  }
}
