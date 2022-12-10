import { sumSignalStrengths, drawPixels } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day10', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day10/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day10/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('sumSignalStrengths', () => {
    expect(sumSignalStrengths(inputTest)).toBe(13140);
    expect(sumSignalStrengths(input)).toBe(15880);
  });

  test('drawPixels', () => {
    expect(drawPixels(inputTest)).toBe(
      "##..##..##..##..##..##..##..##..##..##..\n" +
      "###...###...###...###...###...###...###.\n" +
      "####....####....####....####....####....\n" +
      "#####.....#####.....#####.....#####.....\n" +
      "######......######......######......####\n" +
      "#######.......#######.......#######....."
    );
    expect(drawPixels(input)).toBe(
      "###..#.....##..####.#..#..##..####..##..\n" +
      "#..#.#....#..#.#....#.#..#..#....#.#..#.\n" +
      "#..#.#....#....###..##...#..#...#..#....\n" +
      "###..#....#.##.#....#.#..####..#...#.##.\n" +
      "#....#....#..#.#....#.#..#..#.#....#..#.\n" +
      "#....####..###.#....#..#.#..#.####..###."
    );
  });
});
