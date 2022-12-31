import { Vector } from "../lib/vector";

const SENSOR_PATTERN: RegExp = /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/;
const TUNING_FREQUENCY_FACTOR: number = 4000000;
const DIRECTIONS: Vector[] = [new Vector(1, -1), new Vector(1, 1), new Vector(-1, 1), new Vector(-1, -1)];

class Sensor {
  position: Vector;
  closestBeacon: Vector;

  constructor(position: Vector, closestBeacon: Vector) {
    this.position = position;
    this.closestBeacon = closestBeacon;
  }

  distanceToBeacon(): number {
    return this.position.distance(this.closestBeacon);
  }
}

function parseSensors(input: string[]): Sensor[] {
  let sensors: Sensor[] = input.map(line => {
    const m = line.match(SENSOR_PATTERN);
    if (!m) {
      throw new Error('No regex match');
    }
    return new Sensor(new Vector(parseInt(m[1]), parseInt(m[2])), new Vector(parseInt(m[3]), parseInt(m[4])));
  });

  return sensors.sort((a, b) => a.distanceToBeacon() - b.distanceToBeacon());
}

export function countNonBeaconPositions(input: string[], row: number): number {
  const sensors: Sensor[] = parseSensors(input);
  let nonPositions: Set<number> = new Set;

  for (const sensor of sensors) {
    const distance: number = sensor.distanceToBeacon();
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

function isPositionValid(position: Vector, sensors: Sensor[], bound: number): boolean {
  if (position.x < 0 || position.x > bound || position.y < 0 || position.y > bound) {
    return false;
  }

  for (const sensor of sensors) {
    if (position.distance(sensor.position) <= sensor.distanceToBeacon()) {
      return false;
    }
  }

  return true;
}

function checkSensorCouple(sensorA: Sensor, sensorB: Sensor, sensors: Sensor[], bound: number): Vector | null {
  const middle: Vector = new Vector(
    Math.floor((sensorB.distanceToBeacon() * sensorA.position.x + sensorA.distanceToBeacon() * sensorB.position.x) / (sensorA.distanceToBeacon() + sensorB.distanceToBeacon())),
    Math.floor((sensorB.distanceToBeacon() * sensorA.position.y + sensorA.distanceToBeacon() * sensorB.position.y) / (sensorA.distanceToBeacon() + sensorB.distanceToBeacon())),
  );

  for (const direction of DIRECTIONS) {
    let position: Vector = new Vector(middle.x, middle.y);
    while (position.distance(sensorA.position) == sensorA.distanceToBeacon() + 1 && position.distance(sensorB.position) === sensorB.distanceToBeacon() + 1) {
      if (isPositionValid(position, sensors, bound)) {
        return position;
      }
      position.add(direction);
    }
  }

  return null;
}

export function findTuningFrequency(input: string[], bound: number): number {
  const sensors: Sensor[] = parseSensors(input);

  for (let i = 0; i < sensors.length; i++) {
    for (let j = i + 1; j < sensors.length; j++) {

      if (sensors[i].position.distance(sensors[j].position) === sensors[i].distanceToBeacon() + sensors[j].distanceToBeacon() + 2) {
        const beaconPosition: Vector | null = checkSensorCouple(sensors[i], sensors[j], sensors, bound);
        if (beaconPosition) {
          return beaconPosition.x * TUNING_FREQUENCY_FACTOR + beaconPosition.y;
        }
      }
    }
  }

  throw new Error('No valid beacon position found');
}
