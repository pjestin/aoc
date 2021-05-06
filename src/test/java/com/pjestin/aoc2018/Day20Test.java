package com.pjestin.aoc2018;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day20Test {
  private static List<String> inputTest1Lines, inputTest2Lines, inputTest3Lines, inputTest4Lines, inputTest5Lines,
      inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTest1Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input-test-1.txt"));
    inputTest2Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input-test-2.txt"));
    inputTest3Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input-test-3.txt"));
    inputTest4Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input-test-4.txt"));
    inputTest5Lines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input-test-5.txt"));
    inputLines = FileUtils
        .readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2018", "day20", "input.txt"));
  }

  @Test
  public void findFarthestRoomTest() {
    assertEquals(3, Day20.findFarthestRoom(inputTest1Lines));
    assertEquals(10, Day20.findFarthestRoom(inputTest2Lines));
    assertEquals(18, Day20.findFarthestRoom(inputTest3Lines));
    assertEquals(23, Day20.findFarthestRoom(inputTest4Lines));
    assertEquals(31, Day20.findFarthestRoom(inputTest5Lines));
    assertEquals(3699, Day20.findFarthestRoom(inputLines));
  }

  @Test
  public void findRoomsFartherThan1000DoorsTest() {
    assertEquals(0, Day20.findRoomsFartherThan1000Doors(inputTest1Lines));
    assertEquals(8517, Day20.findRoomsFartherThan1000Doors(inputLines));
  }
}
