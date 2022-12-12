import { Queue } from "../lib/queue";
import { Vector } from "../lib/vector";

class State {
  position: Vector;
  steps: number;

  constructor(position: Vector, steps: number) {
    this.position = position;
    this.steps = steps;
  }
}

const NEIGHBOR_DIRECTIONS: Vector[] = [new Vector(1, 0), new Vector(-1, 0), new Vector(0, 1), new Vector(0, -1)];

function parseInput(input: string[]): [number[][], Vector, Vector] {
  let heightMap: number[][] = [...Array(input.length).keys()].map(_ => new Array(input[0].length).fill(0));
  let start: Vector = new Vector(0, 0);
  let end: Vector = new Vector(0, 0);

  for (let row = 0; row < input.length; row++) {
    for (let col = 0; col < input[0].length; col++) {
      switch (input[row].charAt(col)) {
        case 'S':
          start.x = col;
          start.y = row;
          heightMap[row][col] = 0;
          break;
        case 'E':
          end.x = col;
          end.y = row;
          heightMap[row][col] = 'z'.charCodeAt(0) - 'a'.charCodeAt(0);
          break;
        default:
          heightMap[row][col] = input[row].charCodeAt(col) - 'a'.charCodeAt(0);
          break;
      }
    }
  }

  return [heightMap, start, end];
}

function findShortestPath(heightMap: number[][], start: Vector, endTest: (position: Vector) => boolean, heightTest: (diff: number) => boolean): number {
  let queue: Queue<State> = new Queue;
  queue.push(new State(start, 0));

  let visited: Set<string> = new Set;

  while (!queue.isEmpty()) {
    const state: State = queue.pop();

    if (endTest(state.position)) {
      return state.steps;
    } else if (visited.has(state.position.toString())) {
      continue;
    }

    visited.add(state.position.toString());

    for (const neighborDirection of NEIGHBOR_DIRECTIONS) {
      const neighbor: Vector = new Vector(state.position.x + neighborDirection.x, state.position.y + neighborDirection.y);

      if (neighbor.x < 0 || neighbor.x >= heightMap[0].length || neighbor.y < 0 || neighbor.y >= heightMap.length) {
        continue;
      }

      const neighborHeight: number = heightMap[neighbor.y][neighbor.x];
      const thisHeight: number = heightMap[state.position.y][state.position.x];

      if (heightTest(neighborHeight - thisHeight)) {
        queue.push(new State(neighbor, state.steps + 1));
      }
    }
  }

  throw new Error('No path found');
}

export function countLeastSteps(input: string[]): number {
  const [heightMap, start, end]: [number[][], Vector, Vector] = parseInput(input);

  return findShortestPath(
    heightMap,
    start,
    (position: Vector) => position.equals(end),
    (diff: number) => diff <= 1,
  );
}

export function findMostExercisePath(input: string[]): number {
  const [heightMap, _, end]: [number[][], Vector, Vector] = parseInput(input);

  return findShortestPath(
    heightMap,
    end,
    (position: Vector) => heightMap[position.y][position.x] === 0,
    (diff: number) => diff >= -1,
  );
}
