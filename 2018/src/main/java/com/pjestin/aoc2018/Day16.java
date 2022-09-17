package com.pjestin.aoc2018;

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

import com.pjestin.lib.Instruction;

class Day16 {
  private static class RawInstruction {
    public int opcode;
    public int[] params;

    public RawInstruction(int opcode, int[] params) {
      this.opcode = opcode;
      this.params = params;
    }

    public String toString() {
      return String.format("%d %s", opcode, Arrays.toString(params));
    }
  }

  private static final Set<String> OPCODES = new HashSet<>(Arrays.asList("addr", "addi", "mulr", "muli", "banr", "bani",
      "borr", "bori", "setr", "seti", "gtir", "gtri", "gtrr", "eqir", "eqri", "eqrr"));

  private static class Sample {
    public int[] registersBefore;
    public RawInstruction instruction;
    public int[] registersAfter;

    public String toString() {
      return String.format("%s\n%s\n%s\n", Arrays.toString(registersBefore), instruction,
          Arrays.toString(registersAfter));
    }
  }

  private static List<Sample> parseSamples(List<String> lines) {
    List<Sample> samples = new ArrayList<>();
    Sample currentSample = new Sample();
    for (String line : lines) {
      if (line.isBlank()) {
        if (currentSample.registersBefore == null && currentSample.registersAfter == null
            && currentSample.instruction == null) {
          break;
        }
        samples.add(currentSample);
        currentSample = new Sample();
      } else if (line.startsWith("Before")) {
        currentSample.registersBefore = Stream.of(line.split("[\\[\\]]")[1].split(", ")).mapToInt(Integer::parseInt)
            .toArray();
      } else if (line.startsWith("After")) {
        currentSample.registersAfter = Stream.of(line.split("[\\[\\]]")[1].split(", ")).mapToInt(Integer::parseInt)
            .toArray();
      } else {
        String[] instruction = line.split(" ");
        int[] params = Stream.of(Arrays.copyOfRange(instruction, 1, 4)).mapToInt(Integer::parseInt).toArray();
        currentSample.instruction = new RawInstruction(Integer.valueOf(instruction[0]), params);
      }
    }
    return samples;
  }

  private static List<RawInstruction> parseInstructions(List<String> lines) {
    List<RawInstruction> instructions = new ArrayList<>();
    boolean previousLineIsBlank = false;
    boolean foundTwoBlankLines = false;
    for (String line : lines) {
      if (line.isBlank()) {
        if (previousLineIsBlank) {
          foundTwoBlankLines = true;
        } else {
          previousLineIsBlank = true;
        }
        continue;
      } else {
        previousLineIsBlank = false;
      }
      if (foundTwoBlankLines) {
        String[] instruction = line.split(" ");
        int[] params = Stream.of(Arrays.copyOfRange(instruction, 1, 4)).mapToInt(Integer::parseInt).toArray();
        instructions.add(new RawInstruction(Integer.valueOf(instruction[0]), params));
      }
    }
    return instructions;
  }

  private static Set<String> getPossibleOpcodes(Sample sample) {
    Set<String> possibleOpcodes = new HashSet<>();
    for (String opcode : OPCODES) {
      int[] registers = sample.registersBefore.clone();
      Instruction instruction = new Instruction(opcode, sample.instruction.params);
      instruction.run(registers);
      if (Arrays.equals(registers, sample.registersAfter)) {
        possibleOpcodes.add(opcode);
      }
    }
    return possibleOpcodes;
  }

  public static int countMultimorphicSamples(List<String> lines) {
    List<Sample> samples = parseSamples(lines);
    int multimorphicCount = 0;
    for (Sample sample : samples) {
      Set<String> possibleOpcodes = getPossibleOpcodes(sample);
      if (possibleOpcodes.size() >= 3) {
        multimorphicCount++;
      }
    }
    return multimorphicCount;
  }

  private static Map<Integer, String> buildOpcodeMap(List<Sample> samples) throws Exception {
    Map<Integer, Set<String>> opcodePossibilities = new HashMap<>();
    for (int i = 0; i < OPCODES.size(); i++) {
      opcodePossibilities.put(i, new HashSet<>(OPCODES));
    }
    for (Sample sample : samples) {
      Set<String> possibleOpcodes = getPossibleOpcodes(sample);
      Set<String> possibilities = opcodePossibilities.get(sample.instruction.opcode);
      possibilities.retainAll(possibleOpcodes);
    }
    Map<Integer, String> opcodeMap = new HashMap<>();
    while (opcodeMap.size() != OPCODES.size()) {
      for (int i = 0; i < OPCODES.size(); i++) {
        if (opcodePossibilities.get(i).size() == 1) {
          String stringOpcode = opcodePossibilities.get(i).iterator().next();
          opcodeMap.put(i, stringOpcode);
          for (Set<String> possibilities : opcodePossibilities.values()) {
            possibilities.remove(stringOpcode);
          }
        }
      }
    }
    return opcodeMap;
  }

  private static Instruction convertInstruction(RawInstruction rawInstruction, Map<Integer, String> opcodeMap) {
    String opcodeString = opcodeMap.get(rawInstruction.opcode);
    return new Instruction(opcodeString, rawInstruction.params);
  }

  public static int runInputProgram(List<String> lines) throws Exception {
    List<Sample> samples = parseSamples(lines);
    List<RawInstruction> rawInstructions = parseInstructions(lines);
    Map<Integer, String> opcodeMap = buildOpcodeMap(samples);
    int[] registers = new int[4];
    for (RawInstruction rawInstruction : rawInstructions) {
      Instruction instruction = convertInstruction(rawInstruction, opcodeMap);
      instruction.run(registers);
    }
    return registers[0];
  }
}
