import { countVisibleTrees, getBestScenicScore } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day08', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day08/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day08/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countVisibleTrees', () => {
    expect(countVisibleTrees(inputTest)).toBe(21);
    expect(countVisibleTrees(input)).toBe(1715);
  });

  test('getBestScenicScore', () => {
    expect(getBestScenicScore(inputTest)).toBe(8);
    expect(getBestScenicScore(input)).toBe(374400);
  });
});
