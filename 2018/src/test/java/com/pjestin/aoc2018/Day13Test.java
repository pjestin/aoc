package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day13Test {
  private static List<String> inputTestLines, inputTest2Lines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day13", "input-test.txt"));
    inputTest2Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day13", "input-test-2.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day13", "input.txt"));
  }

  @Test
  public void getCrashCoordinatesTest() {
    assertEquals("7,3", Day13.getCrashCoordinates(inputTestLines));
    assertEquals("8,3", Day13.getCrashCoordinates(inputLines));
  }

  @Test
  public void getLastRemainingCartCoordinatesTest() {
    assertEquals("6,4", Day13.getLastRemainingCartCoordinates(inputTest2Lines));
    assertEquals("73,121", Day13.getLastRemainingCartCoordinates(inputLines));
  }
}
