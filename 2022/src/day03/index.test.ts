import { sumCompartmentPriorities, sumGroupPriorities } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day03', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day03/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day03/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('sumCompartmentPriorities', () => {
    expect(sumCompartmentPriorities(inputTest)).toBe(157);
    expect(sumCompartmentPriorities(input)).toBe(7691);
  });

  test('sumGroupPriorities', () => {
    expect(sumGroupPriorities(inputTest)).toBe(70);
    expect(sumGroupPriorities(input)).toBe(2508);
  });
});
