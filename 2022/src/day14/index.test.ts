import { countSandAtRestInfiniteVoid, countSandAtRestFloor } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day14', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day14/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day14/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countSandAtRestInfiniteVoid', () => {
    expect(countSandAtRestInfiniteVoid(inputTest)).toBe(24);
    expect(countSandAtRestInfiniteVoid(input)).toBe(674);
  });

  test('countSandAtRestFloor', () => {
    expect(countSandAtRestFloor(inputTest)).toBe(93);
    expect(countSandAtRestFloor(input)).toBe(24958);
  });
});
