import { findDirectorySizes, findDirectoryToDelete } from '.';
import * as fs from 'fs';
import * as path from 'path';

describe('day07', () => {
  let inputTest: string[] = fs.readFileSync(path.resolve('src/day07/input-test.txt'), 'utf8').split('\n').slice(0, -1);
  let input: string[] = fs.readFileSync(path.resolve('src/day07/input.txt'), 'utf8').split('\n').slice(0, -1);

  test('findDirectorySizes', () => {
    expect(findDirectorySizes(inputTest)).toBe(95437);
    expect(findDirectorySizes(input)).toBe(1307902);
  });

  test('findDirectoryToDelete', () => {
    expect(findDirectoryToDelete(inputTest)).toBe(24933642);
    expect(findDirectoryToDelete(input)).toBe(7068748);
  });
});
