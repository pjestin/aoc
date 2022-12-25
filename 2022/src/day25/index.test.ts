import { sumSnafuNumbers } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day25', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day25/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day25/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('sumSnafuNumbers', () => {
    expect(sumSnafuNumbers(inputTest)).toBe('2=-1=0');
    expect(sumSnafuNumbers(input)).toBe('2011-=2=-1020-1===-1');
  });
});
