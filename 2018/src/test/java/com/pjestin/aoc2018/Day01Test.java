package com.pjestin.aoc2018;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day01Test {
  private static List<String> inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day01", "input.txt"));
  }

  @Test
  public void getFrequencyTest() {
    assertEquals(472, Day01.getFrequency(inputLines));
  }

  @Test
  public void getFirstReoccurringFrequencyTest() {
    assertEquals(66932, Day01.getFirstReoccurringFrequency(inputLines));
  }
}
