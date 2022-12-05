import { Stack } from '../lib/stack';

class Instruction {
  nCrates: number;
  origin: number;
  destination: number;

  constructor(nCrates: number, origin: number, destination: number) {
    this.nCrates = nCrates;
    this.origin = origin;
    this.destination = destination;
  }

  toString(): string {
    return 'move ' + this.nCrates + ' from ' + this.origin + ' to ' + this.destination;
  }
}

function splitInput(input: string[]): [string[], string[]] {
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      return [input.slice(0, i), input.slice(i + 1)];
    }
  }

  throw new Error('Unable to split input');
}

function parseStacks(inputPart1: string[]): Stack[] {
  const maxLineLength: number = Math.max(...inputPart1.map(line => line.length));
  const nStacks: number = Math.floor(maxLineLength / 4) + 1;
  let protoStacks: string[][] = [...Array(nStacks).keys()].map(_ => []);

  for (const line of inputPart1) {
    for (let i = 0; i < nStacks; i++) {
      if (line[4 * i + 1].match(/[a-z]/i)) {
        protoStacks[i].push(line[4 * i + 1]);
      }
    }
  }

  return protoStacks.map(protoStack => {
    let stack = new Stack();
    for (const e of protoStack.reverse()) {
      stack.push(e);
    }
    return stack;
  });
}

function parseInstructions(inputPart2: string[]): Instruction[] {
  const re = new RegExp(/move (\d+) from (\d+) to (\d+)/);
  return inputPart2.map(line => {
    const m = line.match(re)
    if (m) {
      const nCreates: number = parseInt(m[1]);
      const origin: number = parseInt(m[2]);
      const destination: number = parseInt(m[3]);
      return new Instruction(nCreates, origin, destination);
    } else {
      throw new Error('Unrecognized line: ' + line);
    }
  });
}

function parseInput(input: string[]): [Stack[], Instruction[]] {
  const [inputPart1, inputPart2] = splitInput(input);

  return [parseStacks(inputPart1), parseInstructions(inputPart2)];
}

export function arrangeCrates(input: string[]): string {
  let [stacks, instructions]: [Stack[], Instruction[]] = parseInput(input);

  for (const instruction of instructions) {
    for (let i = 0; i < instruction.nCrates; i++) {
      const crate = stacks[instruction.origin - 1].pop();
      stacks[instruction.destination - 1].push(crate);
    }
  }

  return stacks.map(stack => stack.peek()).join('');
}

export function arrangeCratesByBatch(input: string[]): string {
  let [stacks, instructions]: [Stack[], Instruction[]] = parseInput(input);

  for (const instruction of instructions) {
    const crates: string[] = [...Array(instruction.nCrates).keys()].map(_ => stacks[instruction.origin - 1].pop()).reverse();
    crates.forEach(crate => stacks[instruction.destination - 1].push(crate));
  }

  return stacks.map(stack => stack.peek()).join('');
}
