enum InstructionType {
  Noop,
  AddX,
}

class Instruction {
  type: InstructionType;
  arg: number;

  constructor(type: InstructionType, arg: number = 0) {
    this.type = type;
    this.arg = arg;
  }
}

const MEASURE_CYCLES: Set<number> = new Set([20, 60, 100, 140, 180, 220]);
const SCREEN_WIDTH: number = 40;
const SCREEN_HEIGHT: number = 6;

function parseInstructions(input: string[]): Instruction[] {
  return input.map(line => {
    const splitLine: string[] = line.split(' ');
    if (splitLine.length === 1) {
      return new Instruction(InstructionType.Noop);
    } else if (splitLine.length === 2) {
      return new Instruction(InstructionType.AddX, parseInt(splitLine[1]));
    } else {
      throw new Error('Invalid line: ' + line);
    }
  });
}

export function sumSignalStrengths(input: string[]): number {
  const instructions: Instruction[] = parseInstructions(input);

  let x: number = 1;
  let cycle: number = 0;
  let signalStrengthSum: number = 0;

  for (const instruction of instructions) {
    cycle += 1;
    if (MEASURE_CYCLES.has(cycle)) {
      signalStrengthSum += cycle * x;
    }
    if (instruction.type === InstructionType.AddX) {
      cycle += 1;
      if (MEASURE_CYCLES.has(cycle)) {
        signalStrengthSum += cycle * x;
      }
      x += instruction.arg;
    }
  }

  return signalStrengthSum;
}

function placePixel(pixels: boolean[][], cycle: number, x: number) {
  pixels[Math.floor((cycle - 1) / SCREEN_WIDTH)][(cycle - 1) % SCREEN_WIDTH] = (Math.abs((cycle - 1) % SCREEN_WIDTH - x) <= 1);
}

function displayScreen(pixels: boolean[][]): string {
  return pixels.map(row => row.map(pixel => pixel ? '#' : '.').join('')).join('\n');
}

export function drawPixels(input: string[]): string {
  const instructions: Instruction[] = parseInstructions(input);

  let pixels: boolean[][] = [...Array(SCREEN_HEIGHT).keys()].map(_ => new Array(SCREEN_WIDTH).fill(false));
  let x: number = 1;
  let cycle: number = 0;

  for (const instruction of instructions) {
    cycle += 1;
    if (cycle > SCREEN_WIDTH * SCREEN_HEIGHT) {
      break;
    }
    placePixel(pixels, cycle, x);
    if (instruction.type === InstructionType.AddX) {
      cycle += 1;
      if (cycle > SCREEN_WIDTH * SCREEN_HEIGHT) {
        break;
      }
      placePixel(pixels, cycle, x);
      x += instruction.arg;
    }
  }

  return displayScreen(pixels);
}
