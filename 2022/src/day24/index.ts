import { mod } from "../lib/mod";
import { lcm } from "../lib/gcd";
import { Queue } from "../lib/queue";
import { Vector } from "../lib/vector";

const DIRECTIONS: Vector[] = [
  new Vector(1, 0),
  new Vector(-1, 0),
  new Vector(0, 1),
  new Vector(0, -1),
];

class Blizzard {
  position: Vector;
  direction: Vector;

  constructor(position: Vector, direction: Vector) {
    this.position = position;
    this.direction = direction;
  }
}

class State {
  position: Vector;
  time: number;

  constructor(position: Vector, time: number) {
    this.position = position;
    this.time = time;
  }

  hash(size: number): string {
    return `${this.position.toString()};${mod(this.time, size)}`;
  }
}

function parseBlizzards(input: string[]): [{ [s: string]: Blizzard }, Vector, Vector, number, number] {
  const start: Vector = new Vector(1, 0);
  let end: Vector | null = null;
  let blizzards: { [s: string]: Blizzard } = {};

  for (let row = 0; row < input.length; row++) {
    if (input[row].endsWith('###')) {
      continue;
    } else if (input[row].startsWith('###')) {
      end = new Vector(input[row].indexOf('.'), row);
    } else {
      for (let col = 0; col < input[row].length; col++) {
        const position: Vector = new Vector(col, row);
        switch (input[row][col]) {
          case '>':
            blizzards[position.toString()] = new Blizzard(position, new Vector(1, 0));
            break;
          case 'v':
            blizzards[position.toString()] = new Blizzard(position, new Vector(0, 1));
            break;
          case '<':
            blizzards[position.toString()] = new Blizzard(position, new Vector(-1, 0));
            break;
          case '^':
            blizzards[position.toString()] = new Blizzard(position, new Vector(0, -1));
            break;
        }
      }
    }
  }

  return [blizzards, start, end as Vector, input[0].length - 2, input.length - 2];
}

function checkForBlizzards(position: Vector, blizzards: { [s: string]: Blizzard }, time: number, sizeX: number, sizeY: number): boolean {
  for (const blizzardDirection of DIRECTIONS) {
    const blizzardPosition: Vector = new Vector(
      mod(position.x - blizzardDirection.x * time - 1, sizeX) + 1,
      mod(position.y - blizzardDirection.y * time - 1, sizeY) + 1,
    );

    if (blizzards[blizzardPosition.toString()]?.direction.equals(blizzardDirection)) {
      return true;
    }
  }

  return false;
}

function findShortestPath(blizzards: { [s: string]: Blizzard }, start: Vector, end: Vector, sizeX: number, sizeY: number, startTime: number): number {
  const size: number = lcm(sizeX, sizeY);
  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue;
  queue.push(new State(start, startTime));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();
    const stateHash: string = state.hash(size);

    if (!state.position.equals(start) && (
      state.position.x < 1 || state.position.x > sizeX || state.position.y < 1 || state.position.y > sizeY
    )) {
      continue;
    } else if (visited.has(stateHash)) {
      continue;
    }

    visited.add(stateHash);
    
    for (const neighbor of DIRECTIONS) {
      const neighborPosition: Vector = new Vector(state.position.x + neighbor.x, state.position.y + neighbor.y);

      if (neighborPosition.equals(end)) {
        return state.time + 1;
      }

      if (!checkForBlizzards(neighborPosition, blizzards, state.time + 1, sizeX, sizeY)) {
        queue.push(new State(neighborPosition, state.time + 1));
      }
    }

    if (state.position.equals(start) || !checkForBlizzards(state.position, blizzards, state.time + 1, sizeX, sizeY)) {
      queue.push(new State(state.position, state.time + 1));
    }
  }

  throw new Error('no path found');
}

export function findShortestPathStartToEnd(input: string[]): number {
  const [blizzards, start, end, sizeX, sizeY]: [{ [s: string]: Blizzard }, Vector, Vector, number, number] = parseBlizzards(input);

  return findShortestPath(blizzards, start, end, sizeX, sizeY, 0);
}

export function findShortestTriplePath(input: string[]): number {
  const [blizzards, start, end, sizeX, sizeY]: [{ [s: string]: Blizzard }, Vector, Vector, number, number] = parseBlizzards(input);

  const trip1: number = findShortestPath(blizzards, start, end, sizeX, sizeY, 0);
  const trip2: number = findShortestPath(blizzards, end, start, sizeX, sizeY, trip1);
  return findShortestPath(blizzards, start, end, sizeX, sizeY, trip2);
}
