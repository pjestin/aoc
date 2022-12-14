import { findFinalPassword } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day22', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day22/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day22/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findFinalPassword', () => {
    expect(findFinalPassword(inputTest, false)).toBe(6032);
    expect(findFinalPassword(input, false)).toBe(20494);
  });

  test('findFinalPassword - cube wrap', () => {
    expect(findFinalPassword(input, true)).toBe(55343);
  });
});
