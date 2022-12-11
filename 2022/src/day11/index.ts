import { lcm } from '../lib/gcd';

class Monkey {
  items: number[];
  operation: (old: number) => number;
  testNumber: number;
  destinationIfTrue: number;
  destinationIfFalse: number;
  activity: number;

  constructor(items: number[], operation: (old: number) => number, testNumber: number, destinationIfTrue: number, destinationIfFalse: number) {
    this.items = items;
    this.operation = operation;
    this.testNumber = testNumber;
    this.destinationIfTrue = destinationIfTrue;
    this.destinationIfFalse = destinationIfFalse;
    this.activity = 0;
  }
}

function parseMonkeys(input: string[]): Monkey[] {
  let monkeys: Monkey[] = [];
  let monkey: Monkey = new Monkey([], () => 0, 0, 0, 0);

  for (const line of input) {
    if (line === '') {
      monkeys.push(monkey);
      monkey = new Monkey([], () => 0, 0, 0, 0);
    } else if (line.includes('Starting items')) {
      monkey.items = line.split(':')[1].split(',').map(item => parseInt(item));
    } else if (line.includes('Operation')) {
      monkey.operation = (old: number) => eval(line.split('=')[1]);
    } else if (line.includes('Test')) {
      const splitLine: string[] = line.split(' ');
      monkey.testNumber = parseInt(splitLine[splitLine.length - 1]);
    } else if (line.includes('If true')) {
      const splitLine: string[] = line.split(' ');
      monkey.destinationIfTrue = parseInt(splitLine[splitLine.length - 1]);
    } else if (line.includes('If false')) {
      const splitLine: string[] = line.split(' ');
      monkey.destinationIfFalse = parseInt(splitLine[splitLine.length - 1]);
    }
  }

  monkeys.push(monkey);
  return monkeys;
}

function playRound(monkeys: Monkey[], relief: boolean, factor: number) {
  for (let i = 0; i < monkeys.length; i++) {
    let monkey: Monkey = monkeys[i];
    while (monkey.items.length > 0) {
      let worry: number = monkey.items.shift() as number;
      worry = monkey.operation(worry);
      if (relief) {
        worry = Math.floor(worry / 3);
      } else {
        worry = worry % factor;
      }
      if (worry % monkey.testNumber === 0) {
        monkeys[monkey.destinationIfTrue].items.push(worry);
      } else {
        monkeys[monkey.destinationIfFalse].items.push(worry);
      }
      monkey.activity++;
    }
  }
}

export function findMonkeyBusiness(input: string[], relief: boolean, nRounds: number): number {
  let monkeys: Monkey[] = parseMonkeys(input);
  const factor: number = monkeys.map(monkey => monkey.testNumber).reduce((acc, n) => lcm(acc, n), 1);

  for (let i = 0; i < nRounds; i++) {
    playRound(monkeys, relief, factor);
  }

  let sortedActivity: number[] = monkeys.map(monkey => monkey.activity).sort((a, b) => b - a);
  return sortedActivity[0] * sortedActivity[1];
}
