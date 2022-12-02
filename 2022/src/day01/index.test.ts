import { findMaxCalories, findTotalTop3Calories } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day01', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day01/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day01/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findMaxCalories', () => {
    expect(findMaxCalories(inputTest)).toBe(24000);
    expect(findMaxCalories(input)).toBe(71934);
  });

  test('findTotalTop3Calories', () => {
    expect(findTotalTop3Calories(inputTest)).toBe(45000);
    expect(findTotalTop3Calories(input)).toBe(211447);
  });
});
