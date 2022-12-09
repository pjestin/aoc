import { countTailVisits } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day09', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day09/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let inputTest2: string[] = fs.readFileSync(path.resolve('src/day09/input-test-2.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day09/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countTailVisits - 2 knots', () => {
    expect(countTailVisits(inputTest, 2)).toBe(13);
    expect(countTailVisits(input, 2)).toBe(6311);
  });

  test('countTailVisits - 10 knots', () => {
    expect(countTailVisits(inputTest, 10)).toBe(1);
    expect(countTailVisits(inputTest2, 10)).toBe(36);
    expect(countTailVisits(input, 10)).toBe(2482);
  });
});
