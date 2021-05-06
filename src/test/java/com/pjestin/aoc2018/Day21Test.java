package com.pjestin.aoc2018;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class Day21Test {
  @Test
  public void runProgramLoopOnceTest() {
    assertEquals(2159153, Day21.runProgramLoopOnce());
  }

  @Test
  public void findProgramLastNonRepeatingValueTest() {
    assertEquals(7494885, Day21.findProgramLastNonRepeatingValue());
  }
}
