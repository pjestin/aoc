import { countLeastSteps, findMostExercisePath } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day12', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day12/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day12/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countLeastSteps', () => {
    expect(countLeastSteps(inputTest)).toBe(31);
    expect(countLeastSteps(input)).toBe(528);
  });

  test('findMostExercisePath', () => {
    expect(findMostExercisePath(inputTest)).toBe(29);
    expect(findMostExercisePath(input)).toBe(522);
  });
});
