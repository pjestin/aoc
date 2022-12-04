import { countIncludePairs, countOverlappingPairs } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day04', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day04/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day04/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countIncludePairs', () => {
    expect(countIncludePairs(inputTest)).toBe(2);
    expect(countIncludePairs(input)).toBe(305);
  });

  test('countOverlappingPairs', () => {
    expect(countOverlappingPairs(inputTest)).toBe(4);
    expect(countOverlappingPairs(input)).toBe(811);
  });
});
