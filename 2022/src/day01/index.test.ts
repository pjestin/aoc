import { findMaxCalories, findTotalTop3Calories } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day01', () => {
  test('findMaxCalories', () => {
    expect(findMaxCalories(fs.readFileSync(path.resolve('src/day01/input-test.txt'), 'utf8'))).toBe(24000);
    expect(findMaxCalories(fs.readFileSync(path.resolve('src/day01/input.txt'), 'utf8'))).toBe(71934);
  });

  test('findTotalTop3Calories', () => {
    expect(findTotalTop3Calories(fs.readFileSync(path.resolve('src/day01/input-test.txt'), 'utf8'))).toBe(45000);
    expect(findTotalTop3Calories(fs.readFileSync(path.resolve('src/day01/input.txt'), 'utf8'))).toBe(211447);
  });
});
