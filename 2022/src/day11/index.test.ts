import { findMonkeyBusiness } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day11', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day11/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day11/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findMonkeyBusiness - relief', () => {
    expect(findMonkeyBusiness(inputTest, true, 20)).toBe(10605);
    expect(findMonkeyBusiness(input, true, 20)).toBe(112815);
  });

  test('findMonkeyBusiness - no relief', () => {
    expect(findMonkeyBusiness(inputTest, false, 10000)).toBe(2713310158);
    expect(findMonkeyBusiness(input, false, 10000)).toBe(25738411485);
  });
});
