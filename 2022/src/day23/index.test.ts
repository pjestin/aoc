import { findElfArrangement, countRoundsUntilNoMove } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day23', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day23/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day23/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findElfArrangement', () => {
    expect(findElfArrangement(inputTest)).toBe(110);
    expect(findElfArrangement(input)).toBe(4091);
  });

  test('countRoundsUntilNoMove', () => {
    expect(countRoundsUntilNoMove(inputTest)).toBe(20);
    expect(countRoundsUntilNoMove(input)).toBe(1036);
  });
});
