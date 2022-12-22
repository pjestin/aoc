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

function move(position: Vector, direction: Vector, board: Board): Vector | null {
  let newPosition: Vector = new Vector(position.x + direction.x, position.y + direction.y);

  if (!board.openTiles.has(newPosition.toString()) && !board.wallTiles.has(newPosition.toString())) {
    const antiDirection: Vector = new Vector(-direction.x, -direction.y);
    newPosition.add(antiDirection);
    while (board.openTiles.has(newPosition.toString()) || board.wallTiles.has(newPosition.toString())) {
      newPosition.add(antiDirection);
    }
    newPosition.add(direction);
  }

  if (board.openTiles.has(newPosition.toString())) {
    return newPosition;
  } else if (board.wallTiles.has(newPosition.toString())) {
    return null;
  }

  throw new Error('Unexpected position');
}

function bulkMove(position: Vector, direction: Vector, n: number, board: Board): Vector {
  for (let i = 0; i < n; i++) {
    const newPosition: Vector | null = move(position, direction, board);
    if (!newPosition) {
      break;
    }
    position = newPosition;
  }

  return position;
}

export function findFinalPassword(input: string[]): number {
  const board: Board = parseBoard(input);

  let position: Vector = new Vector(0, 0);
  let direction: Vector = new Vector(1, 0);
  while (!board.openTiles.has(position.toString())) {
    position.x++;
  }

  let numberString: string = '';
  for (const c of board.path) {
    if (isNaN(parseInt(c))) {
      position = bulkMove(position, direction, parseInt(numberString), board);
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
    position = bulkMove(position, direction, parseInt(numberString), board);
  }

  const facing: number = direction.x === 0 ? -(direction.y - 2) : -(direction.x - 1);
  return 1000 * (position.y + 1) + 4 * (position.x + 1) + facing;
}
