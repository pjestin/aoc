import { Vector } from "../lib/vector";

const ROCK_SHAPES: Vector[][] = [
  [new Vector(0, 0), new Vector(1, 0), new Vector(2, 0), new Vector(3, 0)],
  [new Vector(1, 0), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(1, 2)],
  [new Vector(0, 0), new Vector(1, 0), new Vector(2, 0), new Vector(2, 1), new Vector(2, 2)],
  [new Vector(0, 0), new Vector(0, 1), new Vector(0, 2), new Vector(0, 3)],
  [new Vector(0, 0), new Vector(0, 1), new Vector(1, 0), new Vector(1, 1)],
];

const CAVE_WIDTH: number = 7;

function rockElementPosition(rockPosition: Vector, rockElement: Vector): Vector {
  return new Vector(rockPosition.x + rockElement.x, rockPosition.y + rockElement.y);
}

function collision(rockPosition: Vector, rockShape: Vector[], rockAtRest: Set<string>): boolean {
  for (const rockElement of rockShape) {
    const rockElementAbsolute: Vector = rockElementPosition(rockPosition, rockElement);
    if (rockAtRest.has(rockElementAbsolute.toString())
      || rockElementAbsolute.x < 0
      || rockElementAbsolute.x >= CAVE_WIDTH
      || rockElementAbsolute.y < 0
    ) {
      return true;
    }
  }
  return false;
}

function canJet(rockPosition: Vector, rockShape: Vector[], direction: number, rockAtRest: Set<string>): boolean {
  const newRockPosition: Vector = new Vector(rockPosition.x + direction, rockPosition.y);
  return !collision(newRockPosition, rockShape, rockAtRest);
}

function hasFallen(rockPosition: Vector, rockShape: Vector[], rockAtRest: Set<string>): boolean {
  const newRockPosition: Vector = new Vector(rockPosition.x, rockPosition.y - 1);
  return collision(newRockPosition, rockShape, rockAtRest)
}

function getLayoutProfile(rockAtRest: Set<string>, maxY: number): number[] {
  return [...Array(CAVE_WIDTH).keys()].map(x => {
    let y: number = maxY;
    while (y >= 0 && !rockAtRest.has(new Vector(x, y).toString())) {
      y--;
    }
    return maxY - y;
  });
}

function equal(layout1: number[], layout2: number[]): boolean {
  if (layout1.length !== layout2.length) {
    return false;
  }

  for (let i = 0; i < layout1.length; i++) {
    if (layout1[i] !== layout2[i]) {
      return false;
    }
  }

  return true;
}

export function findTowerHeight(input: string, rockNumber: bigint): bigint {
  let rockAtRest: Set<string> = new Set;
  let jetIndex: bigint = 0n;
  let rockIndex: bigint = 0n;
  let maxY: bigint = -1n;
  let maxYOffset: bigint = 0n;
  let cycles: ([bigint, bigint, number[]] | null)[] = new Array(input.length * ROCK_SHAPES.length).fill(null);
  let foundCycle: boolean = false;

  while (rockIndex < rockNumber) {
    const rockIndexMod: number = Number(rockIndex % BigInt(ROCK_SHAPES.length));
    const rockShape: Vector[] = ROCK_SHAPES[rockIndexMod];
    let rockPosition: Vector = new Vector(2, Number(maxY) + 4);

    while (true) {
      const jetIndexMod: number = Number(jetIndex % BigInt(input.length));
      const jet: string = input.charAt(jetIndexMod);
      const jetDirection: number = jet === '>' ? 1 : -1;

      if (canJet(rockPosition, rockShape, jetDirection, rockAtRest)) {
        rockPosition.x += jetDirection;
      }
      jetIndex += 1n;

      if (hasFallen(rockPosition, rockShape, rockAtRest)) {
        for (const rockElement of rockShape) {
          rockAtRest.add(new Vector(rockPosition.x + rockElement.x, rockPosition.y + rockElement.y).toString());
          if (rockPosition.y + rockElement.y > maxY) {
            maxY = BigInt(rockPosition.y + rockElement.y);
          }
        }

        const cycleIndex: number = ROCK_SHAPES.length * jetIndexMod + rockIndexMod;
        const layoutProfile: number[] = getLayoutProfile(rockAtRest, Number(maxY));
        if (!foundCycle && cycles[cycleIndex]) {
          const [previousMaxY, previousRockIndex, previousLayoutProfile]: [bigint, bigint, number[]] = cycles[cycleIndex] as [bigint, bigint, number[]];
          if (equal(layoutProfile, previousLayoutProfile)) {
            const yDiff: bigint = BigInt(maxY - previousMaxY);
            const rockIndexDiff: bigint = rockIndex - previousRockIndex;
            const nCycles: bigint = (rockNumber - rockIndex - 1n) / rockIndexDiff;
            maxYOffset = nCycles * yDiff;
            rockIndex += nCycles * rockIndexDiff;
            foundCycle = true;
          }
        }
        cycles[cycleIndex] = [maxY, rockIndex, layoutProfile];
        break;
      }

      rockPosition.y--;
    }

    rockIndex++;
  }

  return maxY + maxYOffset + 1n;
}
