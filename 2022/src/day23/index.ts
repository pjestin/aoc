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

function parseElves(input: string[]): Set<string> {
  let elves: Set<string> = new Set;

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      if (input[row][col] === '#') {
        const position: Vector = new Vector(col, row);
        elves.add(position.toString());
      }
    }
  }

  return elves;
}

function hasNeighbors(position: Vector, elves: Set<string>): boolean {
  for (const neighbor of NEIGHBORS) {
    const neighborPosition: Vector = new Vector(position.x + neighbor.x, position.y + neighbor.y);
    if (elves.has(neighborPosition.toString())) {
      return true;
    }
  }
  return false;
}

function findFreeDirection(position: Vector, directions: Vector[], elves: Set<string>): Vector | null {
  for (const direction of directions) {
    let isValid: boolean = true;
    const directionsToCheck: Vector[] = direction.x === 0
      ? [direction, new Vector(-1, direction.y), new Vector(1, direction.y)]
      : [direction, new Vector(direction.x, -1), new Vector(direction.x, 1)];

    for (const directionToCheck of directionsToCheck) {
      const positionToCheck: Vector = new Vector(position.x + directionToCheck.x, position.y + directionToCheck.y);
      if (elves.has(positionToCheck.toString())) {
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

function confirmProposals(elfArray: string[], proposals: (string | null)[]): boolean {
  let hasMove: boolean = false;

  for (let i = 0; i < proposals.length; i++) {
    if (!proposals[i]) {
      continue;
    }

    const proposal: string = proposals[i] as string;
    let toBeRemoved: boolean = false;

    for (let j = i + 1; j < proposals.length; j++) {
      if (proposals[j] === proposal) {
        toBeRemoved = true;
        break;
      }
    }

    if (toBeRemoved) {
      for (let j = i; j < proposals.length; j++) {
        if (proposals[j] === proposal) {
          proposals[j] = null;
        }
      }
    } else {
      elfArray[i] = proposal;
      hasMove = true;
    }
  }

  return hasMove;
}

function playRound(elves: Set<string>, directions: Vector[]): boolean {
  let elfArray: string[] = [...elves];
  let proposals: (string | null)[] = new Array(elfArray.length).fill(null);

  for (let i = 0; i < elfArray.length; i++) {
    const elfHash: string = elfArray[i];
    const position: Vector = Vector.fromString(elfHash);
    if (!hasNeighbors(position, elves)) {
      continue;
    }

    const direction: Vector | null = findFreeDirection(position, directions, elves);
    if (direction) {
      const proposedPosition: Vector = new Vector(position.x + direction.x, position.y + direction.y);
      proposals[i] = proposedPosition.toString();
      continue;
    }
  }

  const hasMove: boolean = confirmProposals(elfArray, proposals);

  elves.clear();
  elfArray.forEach(elf => elves.add(elf));

  directions.push(directions.shift() as Vector);

  return hasMove;
}

export function findElfArrangement(input: string[]): number {
  let elves: Set<string> = parseElves(input);
  let directions: Vector[] = [new Vector(0, -1), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 0)];

  for (let i = 0; i < N_ROUNDS; i++) {
    playRound(elves, directions);
  }

  const minX: number = [...elves].reduce((acc, elfHash) => Math.min(acc, Vector.fromString(elfHash).x), Infinity);
  const maxX: number = [...elves].reduce((acc, elfHash) => Math.max(acc, Vector.fromString(elfHash).x), -Infinity);
  const minY: number = [...elves].reduce((acc, elfHash) => Math.min(acc, Vector.fromString(elfHash).y), Infinity);
  const maxY: number = [...elves].reduce((acc, elfHash) => Math.max(acc, Vector.fromString(elfHash).y), -Infinity);

  return (maxX - minX + 1) * (maxY - minY + 1) - elves.size;
}

export function countRoundsUntilNoMove(input: string[]): number {
  let elves: Set<string> = parseElves(input);
  let directions: Vector[] = [new Vector(0, -1), new Vector(0, 1), new Vector(-1, 0), new Vector(1, 0)];

  let count: number = 0;
  while (playRound(elves, directions)) {
    count++;
  }

  return count + 1;
}
