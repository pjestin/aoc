import { findTowerHeight } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day17', () => {
  let inputTest: string = fs.readFileSync(path.resolve('src/day17/input-test.txt'), 'utf8').split('\n')[0];
  let input: string = fs.readFileSync(path.resolve('src/day17/input.txt'), 'utf8').split('\n')[0];

  test('findTowerHeight', () => {
    expect(findTowerHeight(inputTest, 2022n)).toBe(3068n);
    expect(findTowerHeight(input, 2022n)).toBe(3186n);
  });

  test('findTowerHeight - confidence', () => {
    expect(findTowerHeight(inputTest, 1000000000000n)).toBe(1514285714288n);
    expect(findTowerHeight(input, 1000000000000n)).toBe(3186); // 1564431486885 too low, 1564431486930
  });
});
