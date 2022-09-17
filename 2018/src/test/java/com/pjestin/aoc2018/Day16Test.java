package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day16Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day16", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day16", "input.txt"));
  }

  @Test
  public void countMultimorphicSamplesTest() {
    assertEquals(1, Day16.countMultimorphicSamples(inputTestLines));
    assertEquals(567, Day16.countMultimorphicSamples(inputLines));
  }

  @Test
  public void runInputProgramTest() throws Exception {
    assertEquals(610, Day16.runInputProgram(inputLines));
  }
}
