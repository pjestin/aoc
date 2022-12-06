import { findFirstStart } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day06', () => {
  let input: string = fs.readFileSync(path.resolve('src/day06/input.txt'), 'utf8');

  test('findFirstStart - packet', () => {
    expect(findFirstStart("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 4)).toBe(7);
    expect(findFirstStart("bvwbjplbgvbhsrlpgdmjqwftvncz", 4)).toBe(5);
    expect(findFirstStart(input, 4)).toBe(1155);
  });

  test('findFirstStart - message', () => {
    expect(findFirstStart("mjqjpqmgbljsphdztnvjfqwrcgsmlb", 14)).toBe(19);
    expect(findFirstStart("bvwbjplbgvbhsrlpgdmjqwftvncz", 14)).toBe(23);
    expect(findFirstStart(input, 14)).toBe(2789);
  });
});
