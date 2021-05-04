package com.pjestin.aoc2018;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import static java.lang.Integer.parseInt;

import com.pjestin.lib.Instruction;

public class Day19 {
  private static int parseIPRegister(String line) {
    return parseInt(line.split(" ")[1]);
  }

  private static List<Instruction> parseInstructions(List<String> lines) {
    return lines.stream().map(line -> {
      String[] splitLine = line.split(" ");
      String opcode = splitLine[0];
      int[] params = Arrays.stream(Arrays.copyOfRange(splitLine, 1, 4)).mapToInt(Integer::parseInt).toArray();
      return new Instruction(opcode, params);
    }).collect(Collectors.toList());
  }

  public static int runInstructions(List<String> lines) {
    int ipRegister = parseIPRegister(lines.get(0));
    List<Instruction> instructions = parseInstructions(lines.subList(1, lines.size()));
    int[] registers = new int[6];
    while (registers[ipRegister] >= 0 && registers[ipRegister] < instructions.size()) {
      instructions.get(registers[ipRegister]).run(registers);
      registers[ipRegister]++;
    }
    return registers[0];
  }

  public static int findSumOfDivisors(int n) {
    int sum = 0;
    for (int i = 1; i < Math.sqrt(n); ++i) {
      if (n % i == 0) {
        sum += i + n / i;
      }
    }
    return sum;
  }
}
