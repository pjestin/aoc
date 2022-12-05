import { arrangeCrates, arrangeCratesByBatch } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day05', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day05/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day05/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('arrangeCrates', () => {
    expect(arrangeCrates(inputTest)).toBe("CMZ");
    expect(arrangeCrates(input)).toBe("ZRLJGSCTR");
  });

  test('arrangeCratesByBatch', () => {
    expect(arrangeCratesByBatch(inputTest)).toBe("MCD");
    expect(arrangeCratesByBatch(input)).toBe("PRTTGRFPB");
  });
});
