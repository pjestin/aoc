import { Vector } from "../lib/vector";

const SENSOR_PATTERN: RegExp = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
const TUNING_FREQUENCY_FACTOR: number = 4000000;

class Sensor {
  position: Vector;
  closestBeacon: Vector;

  constructor(position: Vector, closestBeacon: Vector) {
    this.position = position;
    this.closestBeacon = closestBeacon;
  }
}

function parseSensors(input: string[]): Sensor[] {
  return input.map(line => {
    const m = line.match(SENSOR_PATTERN);
    if (!m) {
      throw new Error('No regex match');
    }
    return new Sensor(new Vector(parseInt(m[1]), parseInt(m[2])), new Vector(parseInt(m[3]), parseInt(m[4])));
  });
}

export function countNonBeaconPositions(input: string[], row: number): number {
  const sensors: Sensor[] = parseSensors(input);
  let nonPositions: Set<number> = new Set;

  for (const sensor of sensors) {
    const distance: number = sensor.position.distance(sensor.closestBeacon);
    for (let i = 0; i <= distance - Math.abs(row - sensor.position.y); i++) {
      const rowPositionRight: Vector = new Vector(sensor.position.x + i, row);
      const rowPositionLeft: Vector = new Vector(sensor.position.x - i, row);
      if (!rowPositionLeft.equals(sensor.closestBeacon)) {
        nonPositions.add(rowPositionLeft.x);
      }
      if (!rowPositionRight.equals(sensor.closestBeacon)) {
        nonPositions.add(rowPositionRight.x);
      }
    }
  }

  return nonPositions.size;
}

function advanceColumn(x: number, y: number, sensors: Sensor[]): [boolean, number] {
  for (const sensor of sensors) {
    const distance: number = sensor.position.distance(sensor.closestBeacon);
    if (Math.abs(x - sensor.position.x) <= distance - Math.abs(y - sensor.position.y)) {
      return [true, sensor.position.x + distance - Math.abs(y - sensor.position.y) + 1];
    }
  }
  return [false, x];
}

export function findTuningFrequency(input: string[], bound: number): number {
  const sensors: Sensor[] = parseSensors(input);

  for (let y = 0; y <= bound; y++) {
    let x: number = 0;
    let shouldAdvance: boolean = true;
    while (shouldAdvance) {
      [shouldAdvance, x] = advanceColumn(x, y, sensors);
    }

    if (x <= bound) {
      return x * TUNING_FREQUENCY_FACTOR + y;
    }
  }

  throw new Error('Unable to find beacon position');
}
