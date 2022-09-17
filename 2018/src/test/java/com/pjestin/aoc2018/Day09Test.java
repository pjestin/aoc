package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day09Test {
  private static List<String> inputTestLines, inputTest2Lines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day09", "input-test.txt"));
    inputTest2Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day09", "input-test-2.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day09", "input.txt"));
  }

  @Test
  public void getWinningScoreTest() {
    assertEquals(32, Day09.getWinningScore(inputTestLines.get(0)));
    assertEquals(8317, Day09.getWinningScore(inputTest2Lines.get(0)));
    assertEquals(408679, Day09.getWinningScore(inputLines.get(0)));
  }

  @Test
  public void getWinningScoreHundredFoldTest() {
    assertEquals(22563, Day09.getWinningScoreHundredFold(inputTestLines.get(0)));
    assertEquals(74765078, Day09.getWinningScoreHundredFold(inputTest2Lines.get(0)));
    assertEquals(3443939356L, Day09.getWinningScoreHundredFold(inputLines.get(0)));
  }
}
