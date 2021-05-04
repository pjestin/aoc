package com.pjestin.lib;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class InstructionTest {
  @Test
  public void toStringTest() {
    Instruction instruction = new Instruction("seti", new int[] { 1, 0, 2 });
    assertEquals("seti [1, 0, 2]", instruction.toString());
  }

  @Test
  public void runSetiTest() {
    Instruction instruction = new Instruction("seti", new int[] { 1, 0, 2 });
    int[] registers = new int[] { 0, 0, 0, 0 };
    instruction.run(registers);
    assertArrayEquals(new int[] { 0, 0, 1, 0 }, registers);
  }

  @Test
  public void runSetrTest() {
    Instruction instruction = new Instruction("setr", new int[] { 1, 0, 2 });
    int[] registers = new int[] { 1, 2, 3, 4 };
    instruction.run(registers);
    assertArrayEquals(new int[] { 1, 2, 2, 4 }, registers);
  }
}
