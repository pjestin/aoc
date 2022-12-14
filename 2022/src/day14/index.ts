import { Vector } from '../lib/vector';

const SAND_SOURCE: Vector = new Vector(500, 0);

function getInBetweenPositions(start: Vector, end: Vector): Vector[] {
  if (start.x === end.x) {
    if (start.y > end.y) {
      return getInBetweenPositions(end, start);
    }
    let positions: Vector[] = [];
    for (let i = 0; i <= end.y - start.y; i++) {
      positions.push(new Vector(start.x, start.y + i));
    }
    return positions;
  } else if (start.y === end.y) {
    if (start.x > end.x) {
      return getInBetweenPositions(end, start);
    }
    let positions: Vector[] = [];
    for (let i = 0; i <= end.x - start.x; i++) {
      positions.push(new Vector(start.x + i, start.y));
    }
    return positions;
  } else {
    throw new Error('Invalid positions');
  }
}

function parseRock(input: string[]): { [position: string]: Vector } {
  let rock: { [position: string]: Vector } = {};
  for (const line of input) {
    const stops: string[] = line.split(' -> ');
    let previousStop: Vector | null = null;
    for (const stop of stops) {
      const [x, y] = stop.split(',').map(a => parseInt(a));
      const stopVector = new Vector(x, y);
      if (previousStop === null) {
        previousStop = stopVector;
        rock[previousStop.toString()] = previousStop;
      } else {
        const inBetweenPositions: Vector[] = getInBetweenPositions(stopVector, previousStop);
        for (const position of inBetweenPositions) {
          rock[position.toString()] = position;
        }
        previousStop = stopVector;
      }
    }
  }
  return rock;
}

function findNextPosition(position: Vector, obstacles: { [position: string]: Vector }): Vector | null {
  const nextPositions: Vector[] = [new Vector(position.x, position.y + 1), new Vector(position.x - 1, position.y + 1), new Vector(position.x + 1, position.y + 1)];
  for (const nextPosition of nextPositions) {
    if (!obstacles[nextPosition.toString()]) {
      return nextPosition;
    }
  }
  return null;
}

export function countSandAtRestInfiniteVoid(input: string[]): number {
  let obstacles: { [position: string]: Vector } = parseRock(input);
  const maxDepth: number = Object.values(obstacles).reduce((acc, obstacle) => Math.max(acc, obstacle.y), 0);

  let sandIndex: number = 0;
  while (true) {
    let sandPosition: Vector = new Vector(SAND_SOURCE.x, SAND_SOURCE.y);
    while (true) {
      if (sandPosition.y > maxDepth) {
        return sandIndex;
      }
      const nextPosition: Vector | null = findNextPosition(sandPosition, obstacles);
      if (nextPosition) {
        sandPosition = nextPosition;
      } else {
        obstacles[sandPosition.toString()] = sandPosition;
        break;
      }
    }
    sandIndex++;
  }
}

export function countSandAtRestFloor(input: string[]): number {
  let obstacles: { [position: string]: Vector } = parseRock(input);
  const maxDepth: number = Object.values(obstacles).reduce((acc, obstacle) => Math.max(acc, obstacle.y), 0);

  let sandIndex: number = 0;
  while (true) {
    let sandPosition: Vector = new Vector(SAND_SOURCE.x, SAND_SOURCE.y);
    while (true) {
      if (sandPosition.y === maxDepth + 1) {
        obstacles[sandPosition.toString()] = sandPosition;
        break;
      }
      const nextPosition: Vector | null = findNextPosition(sandPosition, obstacles);
      if (nextPosition) {
        sandPosition = nextPosition;
      } else {
        if (sandPosition.equals(SAND_SOURCE)) {
          return sandIndex + 1;
        }
        obstacles[sandPosition.toString()] = sandPosition;
        break;
      }
    }
    sandIndex++;
  }
}
