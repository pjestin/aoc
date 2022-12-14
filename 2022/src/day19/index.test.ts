import { sumQualityLevels, multiplyFirstGeodes } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day19', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day19/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day19/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('sumQualityLevels', () => {
    expect(sumQualityLevels(inputTest)).toBe(33);
    expect(sumQualityLevels(input)).toBe(1147);
  });

  test('multiplyFirstGeodes', () => {
    expect(multiplyFirstGeodes(inputTest)).toBe(3472);
    expect(multiplyFirstGeodes(input)).toBe(3080);
  });
});
