import { findShortestPath } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day24', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day24/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let inputTest2: string[] = fs.readFileSync(path.resolve('src/day24/input-test-2.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day24/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findShortestPath', () => {
    expect(findShortestPath(inputTest)).toBe(10);
    expect(findShortestPath(inputTest2)).toBe(18);
    // expect(findShortestPath(input)).toBe(4091);
  });
});
