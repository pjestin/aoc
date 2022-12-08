function parseTreeHeights(input: string[]): number[][] {
  return input.map(line => line.split('').map(height => parseInt(height)));
}

export function countVisibleTrees(input: string[]): number {
  const treeHeights: number[][] = parseTreeHeights(input);
  let visibleTrees: Set<string> = new Set;

  for (let row = 0; row < treeHeights.length; row++) {
    let rowMaxTree: number = 0;
    for (let col = 0; col < treeHeights[0].length; col++) {
      if (col === 0 || treeHeights[row][col] > rowMaxTree) {
        visibleTrees.add(row + ';' + col);
        rowMaxTree = treeHeights[row][col];
      }
    }

    rowMaxTree = 0;
    for (let col = treeHeights[0].length - 1; col >= 0; col--) {
      if (col === treeHeights[0].length - 1 || treeHeights[row][col] > rowMaxTree) {
        visibleTrees.add(row + ';' + col);
        rowMaxTree = treeHeights[row][col];
      }
    }
  }

  for (let col = 0; col < treeHeights[0].length; col++) {
    let colMaxTree: number = 0;
    for (let row = 0; row < treeHeights.length; row++) {
      if (row === 0 || treeHeights[row][col] > colMaxTree) {
        visibleTrees.add(row + ';' + col);
        colMaxTree = treeHeights[row][col];
      }
    }

    colMaxTree = 0;
    for (let row = treeHeights.length - 1; row >= 0; row--) {
      if (row === treeHeights.length - 1 || treeHeights[row][col] > colMaxTree) {
        visibleTrees.add(row + ';' + col);
        colMaxTree = treeHeights[row][col];
      }
    }
  }

  return visibleTrees.size;
}

function getScenicScore(treeHeights: number[][], thisRow: number, thisCol: number): number {
  let scenicScore: number = 1;

  let foundBlock: boolean = false;
  for (let row = thisRow + 1; row < treeHeights.length; row++) {
    if (treeHeights[row][thisCol] >= treeHeights[thisRow][thisCol]) {
      scenicScore *= row - thisRow;
      foundBlock = true;
      break;
    }
  }
  if (!foundBlock) {
    scenicScore *= treeHeights.length - 1 - thisRow;
  }

  foundBlock = false;
  for (let row = thisRow - 1; row >= 0; row--) {
    if (treeHeights[row][thisCol] >= treeHeights[thisRow][thisCol]) {
      scenicScore *= thisRow - row;
      foundBlock = true;
      break;
    }
  }
  if (!foundBlock) {
    scenicScore *= thisRow;
  }

  foundBlock = false;
  for (let col = thisCol + 1; col < treeHeights[0].length; col++) {
    if (treeHeights[thisRow][col] >= treeHeights[thisRow][thisCol]) {
      scenicScore *= col - thisCol;
      foundBlock = true;
      break;
    }
  }
  if (!foundBlock) {
    scenicScore *= treeHeights[0].length - 1 - thisCol;
  }

  foundBlock = false;
  for (let col = thisCol - 1; col >= 0; col--) {
    if (treeHeights[thisRow][col] >= treeHeights[thisRow][thisCol]) {
      scenicScore *= thisCol - col;
      foundBlock = true;
      break;
    }
  }
  if (!foundBlock) {
    scenicScore *= thisCol;
  }

  return scenicScore;
}

export function getBestScenicScore(input: string[]): number {
  const treeHeights: number[][] = parseTreeHeights(input);
  let maxScenicScore: number = 0;

  for (let row = 0; row < treeHeights.length; row++) {
    for (let col = 0; col < treeHeights[0].length; col++) {
      const scenicScore: number = getScenicScore(treeHeights, row, col);
      maxScenicScore = Math.max(maxScenicScore, scenicScore);
    }
  }

  return maxScenicScore;
}
