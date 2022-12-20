import { findGroveCoordinates } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day20', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day20/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day20/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findGroveCoordinates', () => {
    expect(findGroveCoordinates(inputTest, 1, 1)).toBe(3);
    expect(findGroveCoordinates(input, 1, 1)).toBe(13289);
  });

  test('findGroveCoordinates - decryption', () => {
    expect(findGroveCoordinates(inputTest, 10, 811589153)).toBe(1623178306);
    expect(findGroveCoordinates(input, 10, 811589153)).toBe(2865721299243);
  });
});
