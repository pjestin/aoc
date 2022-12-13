import { findCorrectOrderPairs, organizePackets } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day13', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day13/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day13/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findCorrectOrderPairs', () => {
    expect(findCorrectOrderPairs(inputTest)).toBe(13);
    expect(findCorrectOrderPairs(input)).toBe(6428);
  });

  test('organizePackets', () => {
    expect(organizePackets(inputTest)).toBe(140);
    expect(organizePackets(input)).toBe(22464);
  });
});
