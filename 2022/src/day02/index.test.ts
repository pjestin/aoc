import { findScore, findCorrectScore } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day02', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day02/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day02/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findScore', () => {
    expect(findScore(inputTest)).toBe(15);
    expect(findScore(input)).toBe(15691);
  });

  test('findCorrectScore', () => {
    expect(findCorrectScore(inputTest)).toBe(12);
    expect(findCorrectScore(input)).toBe(12989);
  });
});
