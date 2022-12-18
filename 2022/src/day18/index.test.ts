import { findSurfaceArea } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day18', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day18/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day18/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findSurfaceArea', () => {
    expect(findSurfaceArea(inputTest, false)).toBe(64);
    expect(findSurfaceArea(input, false)).toBe(3466);
  });

  test('findSurfaceArea - correction', () => {
    expect(findSurfaceArea(inputTest, true)).toBe(58);
    expect(findSurfaceArea(input, true)).toBe(2012);
  });
});
