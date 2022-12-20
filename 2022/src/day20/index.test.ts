import { findGroveCoordinates } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day20', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day20/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day20/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findGroveCoordinates', () => {
    // expect(findGroveCoordinates(inputTest)).toBe(3);
    expect(findGroveCoordinates(input)).toBe(1147); // -1418, -3917, -9457, -4401, 3651
  });
});
