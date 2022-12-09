import { Vector } from '../lib/vector';

class Instruction {
  direction: string;
  distance: number;

  constructor(direction: string, distance: number) {
    this.direction = direction;
    this.distance = distance;
  }
}

function parseInstructions(input: string[]): Instruction[] {
  return input.map(line => {
    const splitLine: string[] = line.split(' ');
    return new Instruction(splitLine[0], parseInt(splitLine[1]));
  });
}

function moveHead(head: Vector, instruction: Instruction) {
  switch (instruction.direction) {
    case 'U':
      head.y += 1;
      break;
    case 'D':
      head.y -= 1;
      break;
    case 'L':
      head.x -= 1;
      break;
    case 'R':
      head.x += 1;
      break;
  }
}

function moveTail(tail: Vector, head: Vector) {
  if (Math.abs(head.x - tail.x) + Math.abs(head.y - tail.y) > 2) {
    tail.x += Math.sign(head.x - tail.x);
    tail.y += Math.sign(head.y - tail.y);
  } else if (Math.abs(head.x - tail.x) > 1) {
    tail.x += Math.sign(head.x - tail.x);
  } else if (Math.abs(head.y - tail.y) > 1) {
    tail.y += Math.sign(head.y - tail.y);
  }
}

export function countTailVisits(input: string[], nKnots: number): number {
  const instructions: Instruction[] = parseInstructions(input);

  let knots: Vector[] = [...Array(nKnots).keys()].map(_ => new Vector(0, 0));
  let visits: Set<string> = new Set;
  visits.add(knots[0].toString());

  for (const instruction of instructions) {
    for (let i = 0; i < instruction.distance; i++) {
      moveHead(knots[0], instruction);
      for (let j = 1; j < nKnots; j++) {
        moveTail(knots[j], knots[j - 1]);
      }
      visits.add(knots[knots.length - 1].toString());
    }
  }

  return visits.size;
}
