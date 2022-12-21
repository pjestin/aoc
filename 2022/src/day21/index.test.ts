import { findRootNumber, findNumberToYell } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day21', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day21/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day21/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findRootNumber', () => {
    expect(findRootNumber(inputTest)).toBe(152);
    expect(findRootNumber(input)).toBe(331319379445180);
  });

  test('findNumberToYell', () => {
    expect(findNumberToYell(inputTest)).toBe(301);
    expect(findNumberToYell(input)).toBe(3715799488132);
  });
});
