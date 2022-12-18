import { findMostPressure, findMostPressureWithElephant } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day16', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day16/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day16/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findMostPressure', () => {
    expect(findMostPressure(inputTest)).toBe(1651);
    expect(findMostPressure(input)).toBe(1376);
  });

  test('findMostPressureWithElephant', () => {
    expect(findMostPressureWithElephant(inputTest)).toBe(1707);
    expect(findMostPressureWithElephant(input)).toBe(1933);
  });
});
