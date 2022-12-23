import { Vector } from "../lib/vector";

const N_ROUNDS: number = 10;
const NEIGHBORS: Vector[] = [
  new Vector(1, 0),
  new Vector(1, 1),
  new Vector(0, 1),
  new Vector(-1, 1),
  new Vector(-1, 0),
  new Vector(-1, -1),
  new Vector(0, -1),
  new Vector(1, -1),
];

class Elf {
  position: Vector;
  proposedPosition: Vector | null;

  constructor(position: Vector) {
    this.position = position;
    this.proposedPosition = null;
  }
}

function parseElves(input: string[]): { [s: string]: Elf } {
  let elves: { [s: string]: Elf } = {};

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      if (input[row][col] === '#') {
        const position: Vector = new Vector(col, row);
        elves[position.toString()] = new Elf(position);
      }
    }
  }

  return elves;
}

function hasNeighbors(position: Vector, elves: { [s: string]: Elf }): boolean {
  for (const neighbor of NEIGHBORS) {
    const neighborPosition: Vector = new Vector(position.x + neighbor.x, position.y + neighbor.y);
    if (elves[neighborPosition.toString()]) {
      return true;
    }
  }
  return false;
}

function findFreeDirection(position: Vector, directions: Vector[], elves: { [s: string]: Elf }): Vector | null {
  for (const direction of directions) {
    let isValid: boolean = true;
    const directionsToCheck: Vector[] = direction.x === 0
      ? [direction, new Vector(-1, direction.y), new Vector(1, direction.y)]
      : [direction, new Vector(direction.x, -1), new Vector(direction.x, 1)];

    for (const directionToCheck of directionsToCheck) {
      const positionToCheck: Vector = new Vector(position.x + directionToCheck.x, position.y + directionToCheck.y);
      if (elves[positionToCheck.toString()]) {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      return direction;
    }
  }

  return null;
}

function isProposalValid(elfHash: string, elves: { [s: string]: Elf }): boolean {
  const proposedPosition: Vector | null = elves[elfHash].proposedPosition;
  if (!proposedPosition) {
    return false;
  }

  for (const otherElfHash of Object.keys(elves)) {
    const otherProposedPosition: Vector | null = elves[otherElfHash].proposedPosition;
    if (otherElfHash !== elfHash && otherProposedPosition && otherProposedPosition.equals(proposedPosition)) {
      return false;
    }
  }
  return true;
}

function playRound(elves: { [s: string]: Elf }, directions: Vector[]): boolean {
  let hasMove: boolean = false;
  let proposals: { [proposal: string]: string } = {};

  for (const elfHash of Object.keys(elves)) {
    const elf: Elf = elves[elfHash];
    if (!hasNeighbors(elf.position, elves)) {
      elf.proposedPosition = null;
      continue;
    }

    const direction: Vector | null = findFreeDirection(elf.position, directions, elves);
    if (direction) {
      const proposedPosition: Vector = new Vector(elf.position.x + direction.x, elf.position.y + direction.y);
      if (proposals[proposedPosition.toString()]) {
        const conflictingElf: string = proposals[proposedPosition.toString()];
        elves[conflictingElf].proposedPosition = null;
        continue;
      }
      proposals[proposedPosition.toString()] = elfHash;
      elf.proposedPosition = proposedPosition;
      continue;
    }

    elf.proposedPosition = null;
  }

  for (const elfHash of Object.keys(elves)) {
    if (isProposalValid(elfHash, elves)) {
      const newPosition: Vector = elves[elfHash].proposedPosition as Vector;
      delete elves[elfHash];
      elves[newPosition.toString()] = new Elf(newPosition);
      hasMove = true;
    }
  }

  for (const elfHash of Object.keys(elves)) {
    elves[elfHash].proposedPosition = null;
  }

  directions.push(directions.shift() as Vector);

  return hasMove;
}

export function findElfArrangement(input: string[]): number {
  let elves: { [s: string]: Elf } = parseElves(input);
  let directions: Vector[] = [new Vector(0, -1), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 0)];

  for (let i = 0; i < N_ROUNDS; i++) {
    playRound(elves, directions);
  }

  const minX: number = Object.values(elves).reduce((acc, elf) => Math.min(acc, elf.position.x), Infinity);
  const maxX: number = Object.values(elves).reduce((acc, elf) => Math.max(acc, elf.position.x), -Infinity);
  const minY: number = Object.values(elves).reduce((acc, elf) => Math.min(acc, elf.position.y), Infinity);
  const maxY: number = Object.values(elves).reduce((acc, elf) => Math.max(acc, elf.position.y), -Infinity);

  return (maxX - minX + 1) * (maxY - minY + 1) - Object.keys(elves).length;
}

export function countRoundsUntilNoMove(input: string[]): number {
  let elves: { [s: string]: Elf } = parseElves(input);
  let directions: Vector[] = [new Vector(0, -1), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 0)];

  let count: number = 0;
  while (playRound(elves, directions)) {
    count++;
  }

  return count + 1;
}
