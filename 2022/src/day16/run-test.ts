import { findMostPressureWithElephant } from ".";
import * as fs from 'fs';
import * as path from 'path';

let input: string[] = fs.readFileSync(path.resolve('/home/pierre/src/aoc/2022/src/day16/input.txt'), 'utf8').split('\n').slice(0, -1);
console.log(findMostPressureWithElephant(input));
