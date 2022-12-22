import { Vector } from "../lib/vector";

class Board {
  openTiles: Set<string>;
  wallTiles: Set<string>;
  path: string;

  constructor(openTiles: Set<string>, wallTiles: Set<string>, path: string) {
    this.openTiles = openTiles;
    this.wallTiles = wallTiles;
    this.path = path;
  }
}

function parseBoard(input: string[]): Board {
  let openTiles: Set<string> = new Set;
  let wallTiles: Set<string> = new Set;
  const path: string = input[input.length - 1];

  for (let row = 0; row < input.length; row++) {
    if (input[row] === '') {
      break;
    }

    for (let col = 0; col < input[row].length; col++) {
      const position: Vector = new Vector(col, row);
      switch (input[row][col]) {
        case '.':
          openTiles.add(position.toString());
          break;
        case '#':
          wallTiles.add(position.toString());
          break;
      }
    }
  }

  return new Board(openTiles, wallTiles, path);
}

function wrapWithCube(position: Vector, direction: Vector): [Vector, Vector] {
  if (position.y === -1 && position.x < 100) {
    return [new Vector(0, 100 + position.x), new Vector(1, 0)];
  } else if (position.y === -1 && position.x >= 100) {
    return [new Vector(position.x - 100, 199), new Vector(0, -1)];
  } else if (position.x === 150) {
    return [new Vector(99, 149 - position.y), new Vector(-1, 0)];
  } else if (position.y === 50 && position.x >= 50) {
    return [new Vector(99, position.x - 50), new Vector(-1, 0)];
  } else if (position.x === 100 && position.y < 100) {
    return [new Vector(position.y + 50, 49), new Vector(0, -1)];
  } else if (position.x === 100 && position.y >= 100) {
    return [new Vector(149, 149 - position.y), new Vector(-1, 0)];
  } else if (position.y === 150) {
    return [new Vector(49, position.x + 100), new Vector(-1, 0)];
  } else if (position.x === 50) {
    return [new Vector(position.y - 100, 149), new Vector(0, -1)];
  } else if (position.y === 200) {
    return [new Vector(position.x + 100, 0), new Vector(0, 1)];
  } else if (position.x === -1 && position.y >= 150) {
    return [new Vector(position.y - 100, 0), new Vector(0, 1)];
  } else if (position.x === -1 && position.y < 150) {
    return [new Vector(50, 149 - position.y), new Vector(1, 0)];
  } else if (position.y === 99) {
    return [new Vector(50, position.x + 50), new Vector(1, 0)];
  } else if (position.x === 49 && position.y >= 50) {
    return [new Vector(position.y - 50, 100), new Vector(0, 1)];
  } else if (position.x === 49 && position.y < 50) {
    return [new Vector(0, 149 - position.y), new Vector(1, 0)];
  } else {
    throw new Error(`Unrecognized wrap; position: ${position}; direction: ${direction}`);
  }
}

function move(position: Vector, direction: Vector, board: Board, cubeWrap: boolean): [Vector, Vector] | null {
  let newPosition: Vector = new Vector(position.x + direction.x, position.y + direction.y);

  if (!board.openTiles.has(newPosition.toString()) && !board.wallTiles.has(newPosition.toString())) {
    if (cubeWrap) {
      [newPosition, direction] = wrapWithCube(newPosition, direction);
    } else {
      const antiDirection: Vector = new Vector(-direction.x, -direction.y);
      newPosition.add(antiDirection);
      while (board.openTiles.has(newPosition.toString()) || board.wallTiles.has(newPosition.toString())) {
        newPosition.add(antiDirection);
      }
      newPosition.add(direction);
    }
  }

  if (board.openTiles.has(newPosition.toString())) {
    return [newPosition, direction];
  } else if (board.wallTiles.has(newPosition.toString())) {
    return null;
  }

  throw new Error('Unexpected position');
}

function bulkMove(position: Vector, direction: Vector, n: number, board: Board, cubeWrap: boolean): [Vector, Vector] {
  for (let i = 0; i < n; i++) {
    const newPositionDirection: [Vector, Vector] | null = move(position, direction, board, cubeWrap);
    if (!newPositionDirection) {
      break;
    }
    [position, direction] = newPositionDirection;
  }

  return [position, direction];
}

export function findFinalPassword(input: string[], cubeWrap: boolean): number {
  const board: Board = parseBoard(input);

  let position: Vector = new Vector(0, 0);
  let direction: Vector = new Vector(1, 0);
  while (!board.openTiles.has(position.toString())) {
    position.x++;
  }

  let numberString: string = '';
  for (const c of board.path) {
    if (isNaN(parseInt(c))) {
      [position, direction] = bulkMove(position, direction, parseInt(numberString), board, cubeWrap);
      numberString = '';
      switch (c) {
        case 'R':
          direction = new Vector(-direction.y, direction.x);
          break;
        case 'L':
          direction = new Vector(direction.y, -direction.x);
          break;
        default:
          throw new Error('unrecognized path step');
      }
    } else {
      numberString += c;
    }
  }

  if (numberString.length > 0) {
    [position, direction] = bulkMove(position, direction, parseInt(numberString), board, cubeWrap);
  }

  const facing: number = direction.x === 0 ? -(direction.y - 2) : -(direction.x - 1);
  return 1000 * (position.y + 1) + 4 * (position.x + 1) + facing;
}
