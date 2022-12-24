import { findShortestPathStartToEnd, findShortestTriplePath } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day24', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day24/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let inputTest2: string[] = fs.readFileSync(path.resolve('src/day24/input-test-2.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day24/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findShortestPathStartToEnd', () => {
    expect(findShortestPathStartToEnd(inputTest)).toBe(10);
    expect(findShortestPathStartToEnd(inputTest2)).toBe(18);
    expect(findShortestPathStartToEnd(input)).toBe(262);
  });

  test('findShortestTriplePath', () => {
    expect(findShortestTriplePath(inputTest)).toBe(30);
    expect(findShortestTriplePath(inputTest2)).toBe(54);
    expect(findShortestTriplePath(input)).toBe(785);
  });
});
