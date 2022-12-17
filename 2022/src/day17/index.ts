import { Vector } from "../lib/vector";

const ROCK_SHAPES: Vector[][] = [
  [new Vector(0, 0), new Vector(1, 0), new Vector(2, 0), new Vector(3, 0)],
  [new Vector(1, 0), new Vector(0, 1), new Vector(1, 1), new Vector(2, 1), new Vector(1, 2)],
  [new Vector(0, 0), new Vector(1, 0), new Vector(2, 0), new Vector(2, 1), new Vector(2, 2)],
  [new Vector(0, 0), new Vector(0, 1), new Vector(0, 2), new Vector(0, 3)],
  [new Vector(0, 0), new Vector(0, 1), new Vector(1, 0), new Vector(1, 1)],
];

const CAVE_WIDTH: number = 7;

// function displayShape(rockShape: Vector[]): string {
//   let elements: boolean[][] = [...Array(4).keys()].map(_ => new Array(4).fill(false));

//   for (const element of rockShape) {
//     elements[element.y][element.x] = true;
//   }

//   return elements.reverse().map(row => row.map(element => element ? '#' : ' ').join('')).join('\n');
// }

// function displayTower(rockAtRest: Set<string>, maxY: number): string {
//   let elements: boolean[][] = [...Array(maxY + 1).keys()].map(_ => new Array(CAVE_WIDTH).fill(false));

//   for (const element of rockAtRest) {
//     let elementPosition: Vector = Vector.fromString(element);
//     elements[elementPosition.y][elementPosition.x] = true;
//   }

//   return elements.reverse().map(row => row.map(element => element ? '#' : ' ').join('')).join('\n');
// }

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

export function findTowerHeight(input: string, rockNumber: bigint): bigint {
  let rockAtRest: Set<string> = new Set;
  let jetIndex: bigint = 0n;
  let rockIndex: bigint = 0n;
  let maxY: bigint = -1n;
  let maxYOffset: bigint = 0n;
  let cycles: ([bigint, bigint, bigint] | null)[] = new Array(input.length * ROCK_SHAPES.length * CAVE_WIDTH).fill(null);
  let foundCycle: boolean = false;

  while (rockIndex < rockNumber) {
    // if (rockIndex % 1000 === 0) {
    //   console.log('Rock index:', rockIndex);
    // }
    const rockIndexMod: number = Number(rockIndex % BigInt(ROCK_SHAPES.length));
    const rockShape: Vector[] = ROCK_SHAPES[rockIndexMod];
    // console.log(displayShape(rockShape));
    let rockPosition: Vector = new Vector(2, Number(maxY) + 4);

    while (true) {
      const jetIndexMod: number = Number(jetIndex % BigInt(input.length));
      const jet: string = input.charAt(jetIndexMod);
      // console.log('jet:', jet)
      const jetDirection: number = jet === '>' ? 1 : -1;

      if (canJet(rockPosition, rockShape, jetDirection, rockAtRest)) {
        rockPosition.x += jetDirection;
        // console.log('New rock position after jet:', rockPosition)
      }
      jetIndex += 1n;

      if (hasFallen(rockPosition, rockShape, rockAtRest)) {
        for (const rockElement of rockShape) {
          rockAtRest.add(new Vector(rockPosition.x + rockElement.x, rockPosition.y + rockElement.y).toString());
          if (rockPosition.y + rockElement.y > maxY) {
            maxY = BigInt(rockPosition.y + rockElement.y);
          }
        }

        // console.log('Rock', rockIndex, 'has fallen at position', rockPosition);
        const cycleIndex: number = CAVE_WIDTH * (ROCK_SHAPES.length * jetIndexMod + rockIndexMod) + rockPosition.x;
        if (!foundCycle && cycles[cycleIndex]) {
          const [previousMaxY, previousRockIndex, previousJetIndex]: [bigint, bigint, bigint] = cycles[cycleIndex] as [bigint, bigint, bigint];
          // console.log('previousRockIndex:', previousRockIndex, '; previousMaxY:', previousMaxY, 'maxY:', maxY);
          const yDiff: bigint = BigInt(maxY - previousMaxY);
          const jetIndexDiff: bigint = jetIndex - previousJetIndex;
          const rockIndexDiff: bigint = rockIndex - previousRockIndex;
          // const nCycles: bigint = (rockNumber - rockIndex)
          const nCycles: bigint = (rockNumber - rockIndex) / rockIndexDiff;
          maxYOffset = nCycles * yDiff;
          // console.log('Cycles:', nCycles, '; maxYOffset:', maxYOffset, 'rockIndexDiff:', rockIndexDiff, 'rockNumber:', rockNumber, 'rockIndex:', rockIndex);
          rockIndex += nCycles * rockIndexDiff;
          jetIndex += jetIndexDiff;
          // return 0n;
          foundCycle = true;
        }
        cycles[cycleIndex] = [maxY, rockIndex, jetIndex];
        break;
      }

      rockPosition.y--;
    }

    rockIndex++;
    // console.log('MaxY:', maxY);
    // console.log(displayTower(rockAtRest, maxY))
  }

  return maxY + maxYOffset + 1n;
}
