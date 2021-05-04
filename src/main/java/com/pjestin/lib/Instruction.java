package com.pjestin.lib;

import java.util.Arrays;

public class Instruction {
  public String opcode;
  public int[] params;

  public Instruction(String opcode, int[] params) {
    this.opcode = opcode;
    this.params = params;
  }

  public String toString() {
    return String.format("%s %s", this.opcode, Arrays.toString(this.params));
  }

  public void run(int[] registers) {
    int a = this.params[0];
    int b = this.params[1];
    int value = -1;
    switch (this.opcode) {
      case "addr":
        value = registers[a] + registers[b];
        break;
      case "addi":
        value = registers[a] + b;
        break;
      case "mulr":
        value = registers[a] * registers[b];
        break;
      case "muli":
        value = registers[a] * b;
        break;
      case "banr":
        value = registers[a] & registers[b];
        break;
      case "bani":
        value = registers[a] & b;
        break;
      case "borr":
        value = registers[a] | registers[b];
        break;
      case "bori":
        value = registers[a] | b;
        break;
      case "setr":
        value = registers[a];
        break;
      case "seti":
        value = a;
        break;
      case "gtir":
        value = (a > registers[b] ? 1 : 0);
        break;
      case "gtri":
        value = (registers[a] > b ? 1 : 0);
        break;
      case "gtrr":
        value = (registers[a] > registers[b] ? 1 : 0);
        break;
      case "eqir":
        value = (a == registers[b] ? 1 : 0);
        break;
      case "eqri":
        value = (registers[a] == b ? 1 : 0);
        break;
      case "eqrr":
        value = (registers[a] == registers[b] ? 1 : 0);
        break;
    }
    registers[this.params[2]] = value;
  }
}
