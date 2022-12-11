import { Vector } from '../lib/vector';

function parseTreeHeights(input: string[]): number[][] {
  return input.map(line => line.split('').map(height => parseInt(height)));
}

function getVisibleTreesInDirection(treeHeights: number[][], start: Vector, direction: Vector): Set<string> {
  let trees: Set<string> = new Set;
  let position: Vector = Object.create(start);
  trees.add(position.toString());

  let maxTree: number = 0;
  while (position.x >= 0
    && position.x < treeHeights[0].length
    && position.y >= 0
    && position.y < treeHeights.length
  ) {
    if (position.equals(start) || treeHeights[position.y][position.x] > maxTree) {
      trees.add(position.toString());
      maxTree = treeHeights[position.y][position.x];
    }
    position.add(direction);
  }

  return trees;
}

export function countVisibleTrees(input: string[]): number {
  const treeHeights: number[][] = parseTreeHeights(input);
  let visibleTrees: Set<string> = new Set;

  for (let row = 0; row < treeHeights.length; row++) {
    visibleTrees = new Set([
      ...visibleTrees,
      ...getVisibleTreesInDirection(treeHeights, new Vector(0, row), new Vector(1, 0)),
      ...getVisibleTreesInDirection(treeHeights, new Vector(treeHeights[0].length - 1, row), new Vector(-1, 0)),
    ]);
  }

  for (let col = 0; col < treeHeights[0].length; col++) {
    visibleTrees = new Set([
      ...visibleTrees,
      ...getVisibleTreesInDirection(treeHeights, new Vector(col, 0), new Vector(0, 1)),
      ...getVisibleTreesInDirection(treeHeights, new Vector(col, treeHeights.length - 1), new Vector(0, -1)),
    ]);
  }

  return visibleTrees.size;
}

function countTreesInDirection(treeHeights: number[][], start: Vector, direction: Vector): number {
  let position: Vector = Object.create(start);
  position.add(direction);
  while (position.x >= 0
    && position.x < treeHeights[0].length
    && position.y >= 0
    && position.y < treeHeights.length
  ) {
    if (treeHeights[position.y][position.x] >= treeHeights[start.y][start.x]
    ) {
      return position.distance(start);
    }
    position.add(direction);
  }
  return position.distance(start) - 1;
}

function getScenicScore(treeHeights: number[][], position: Vector): number {
  return countTreesInDirection(treeHeights, position, new Vector(0, 1))
    * countTreesInDirection(treeHeights, position, new Vector(0, -1))
    * countTreesInDirection(treeHeights, position, new Vector(1, 0))
    * countTreesInDirection(treeHeights, position, new Vector(-1, 0));
}

export function getBestScenicScore(input: string[]): number {
  const treeHeights: number[][] = parseTreeHeights(input);
  let maxScenicScore: number = 0;

  for (let row = 0; row < treeHeights.length; row++) {
    for (let col = 0; col < treeHeights[0].length; col++) {
      const scenicScore: number = getScenicScore(treeHeights, new Vector(col, row));
      maxScenicScore = Math.max(maxScenicScore, scenicScore);
    }
  }

  return maxScenicScore;
}
