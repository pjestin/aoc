import { countNonBeaconPositions, findTuningFrequency } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day15', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day15/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day15/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('countNonBeaconPositions', () => {
    expect(countNonBeaconPositions(inputTest, 10)).toBe(26);
    expect(countNonBeaconPositions(input, 2000000)).toBe(4919281);
  });

  test('findTuningFrequency', () => {
    expect(findTuningFrequency(inputTest, 20)).toBe(56000011);
    expect(findTuningFrequency(input, 4000000)).toBe(12630143363767);
  });
});
