import { Stack } from "../lib/stack";
import { Vector } from "../lib/vector";

const NEIGHBORS: Vector[] = [
  new Vector(1, 0, 0),
  new Vector(0, 1, 0),
  new Vector(0, 0, 1),
  new Vector(-1, 0, 0),
  new Vector(0, -1, 0),
  new Vector(0, 0, -1),
];

function parseCubes(input: string[]): Vector[] {
  return input.map(Vector.fromString);
}

function isCubeTrapped(cube: Vector, cubesSet: Set<string>, min: Vector, max: Vector): boolean {
  let visited: Set<string> = new Set;
  let stack: Stack<Vector> = new Stack;
  stack.push(cube);

  while (!stack.isEmpty()) {
    const thisCube: Vector = stack.pop();

    if (visited.has(thisCube.toString()) || cubesSet.has(thisCube.toString())) {
      continue;
    } else if (thisCube.x < min.x || thisCube.y < min.y || thisCube.z < min.z
      || thisCube.x > max.x || thisCube.y > max.y || thisCube.z > max.z
    ) {
      return false;
    }

    visited.add(thisCube.toString());

    for (const neighbor of NEIGHBORS) {
      const neighborCube: Vector = new Vector(thisCube.x + neighbor.x, thisCube.y + neighbor.y, thisCube.z + neighbor.z);
      stack.push(neighborCube);
    }
  }

  return true;
}

export function findSurfaceArea(input: string[], correction: boolean): number {
  const cubes: Vector[] = parseCubes(input);
  const cubeSet: Set<string> = new Set(cubes.map(cube => cube.toString()));
  const min: Vector = new Vector(
    cubes.map(cube => cube.x).reduce((acc, minX) => Math.min(acc, minX), Infinity),
    cubes.map(cube => cube.y).reduce((acc, minY) => Math.min(acc, minY), Infinity),
    cubes.map(cube => cube.z).reduce((acc, minZ) => Math.min(acc, minZ), Infinity),
  );
  const max: Vector = new Vector(
    cubes.map(cube => cube.x).reduce((acc, maxX) => Math.max(acc, maxX), -Infinity),
    cubes.map(cube => cube.y).reduce((acc, maxY) => Math.max(acc, maxY), -Infinity),
    cubes.map(cube => cube.z).reduce((acc, maxZ) => Math.max(acc, maxZ), -Infinity),
  );
  let surfaceArea: number = 0;

  for (const cube of cubes) {
    for (const neighbor of NEIGHBORS) {
      const neighborCube: Vector = new Vector(cube.x + neighbor.x, cube.y + neighbor.y, cube.z + neighbor.z);
      if (!cubeSet.has(neighborCube.toString()) && (!correction || !isCubeTrapped(neighborCube, cubeSet, min, max))) {
        surfaceArea++;
      }
    }
  }

  return surfaceArea;
}
