import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Stream;

class Day16 {
  private static class Instruction {
    public int opcode;
    public int[] params;

    public Instruction(int opcode, int[] params) {
      this.opcode = opcode;
      this.params = params;
    }

    public String toString() {
      return String.format("%d %s", opcode, Arrays.toString(params));
    }
  }

  private static final Set<String> OPCODES = new HashSet<>(Arrays.asList("addr", "addi", "mulr", "muli", "banr", "bani", "borr", "bori", "setr", "seti", "gtir", "gtri", "gtrr", "eqir", "eqri", "eqrr"));

  private static class Sample {
    public int[] registersBefore;
    public Instruction instruction;
    public int[] registersAfter;

    public String toString() {
      return String.format("%s\n%s\n%s\n", Arrays.toString(registersBefore), instruction, Arrays.toString(registersAfter));
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
        currentSample.registersBefore = Stream.of(line.split("[\\[\\]]")[1].split(", "))
          .mapToInt(Integer::parseInt)
          .toArray();
      } else if (line.startsWith("After")) {
        currentSample.registersAfter = Stream.of(line.split("[\\[\\]]")[1].split(", "))
          .mapToInt(Integer::parseInt)
          .toArray();
      } else {
        String[] instruction = line.split(" ");
        int[] params = Stream.of(Arrays.copyOfRange(instruction, 1, 4))
          .mapToInt(Integer::parseInt)
          .toArray();
        currentSample.instruction = new Instruction(Integer.valueOf(instruction[0]), params);
      }
    }
    return samples;
  }

  private static List<Instruction> parseInstructions(List<String> lines) {
    List<Instruction> instructions = new ArrayList<>();
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
        int[] params = Stream.of(Arrays.copyOfRange(instruction, 1, 4))
          .mapToInt(Integer::parseInt)
          .toArray();
          instructions.add(new Instruction(Integer.valueOf(instruction[0]), params));
      }
    }
    return instructions;
  }

  private static void runInstruction(Instruction instruction, int[] registers, String opcodeString) {
    int a = instruction.params[0];
    int b = instruction.params[1];
    int aRegister = registers[a];
    int bRegister = registers[b];
    int value = -1;
    switch (opcodeString) {
      case "addr":
        value = aRegister + bRegister;
        break;
      case "addi":
        value = aRegister + b;
        break;
      case "mulr":
        value = aRegister * bRegister;
        break;
      case "muli":
        value = aRegister * b;
        break;
      case "banr":
        value = aRegister & bRegister;
        break;
      case "bani":
        value = aRegister & b;
        break;
      case "borr":
        value = aRegister | bRegister;
        break;
      case "bori":
        value = aRegister | b;
        break;
      case "setr":
        value = aRegister;
        break;
      case "seti":
        value = a;
        break;
      case "gtir":
        value = (a > bRegister ? 1 : 0);
        break;
      case "gtri":
        value = (aRegister > b ? 1 : 0);
        break;
      case "gtrr":
        value = (aRegister > bRegister ? 1 : 0);
        break;
      case "eqir":
        value = (a == bRegister ? 1 : 0);
        break;
      case "eqri":
        value = (aRegister == b ? 1 : 0);
        break;
      case "eqrr":
        value = (aRegister == bRegister ? 1 : 0);
        break;
    }
    registers[instruction.params[2]] = value;
  }

  private static Set<String> getPossibleOpcodes(Sample sample) {
    Set<String> possibleOpcodes = new HashSet<>();
    for (String opcode : OPCODES) {
      int[] registers = sample.registersBefore.clone();
      runInstruction(sample.instruction, registers, opcode);
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

  public static int runInputProgram(List<String> lines) throws Exception {
    List<Sample> samples = parseSamples(lines);
    List<Instruction> instructions = parseInstructions(lines);
    Map<Integer, String> opcodeMap = buildOpcodeMap(samples);
    int[] registers = new int[4];
    for (Instruction instruction : instructions) {
      String opcodeString = opcodeMap.get(instruction.opcode);
      runInstruction(instruction, registers, opcodeString);
    }
    return registers[0];
  }
}
