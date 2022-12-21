class Monkey {
  name: string;
  value: number | null;
  args: string[];
  op: string | null;

  constructor(name: string, value: number | null, args: string[], op: string | null) {
    this.name = name;
    this.value = value;
    this.args = args;
    this.op = op;
  }
}

function parseMonkeys(input: string[]): { [name: string]: Monkey } {
  return input.map(line => {
    const splitLine: string[] = line.split(': ');
    if (isNaN(parseInt(splitLine[1]))) {
      const expression: string[] = splitLine[1].split(' ');
      return new Monkey(splitLine[0], null, [expression[0], expression[2]], expression[1]);
    } else {
      return new Monkey(splitLine[0], parseInt(splitLine[1]), [], null);
    }
  }).reduce((acc, monkey) => Object.assign(acc, { [monkey.name]: monkey }), {});
}

function getMonkeyNumber(
  name: string,
  monkeys: { [name: string]: Monkey },
  humanOverride: number | null = null,
): number {
  const monkey: Monkey = monkeys[name];
  if (humanOverride !== null && name === 'humn') {
    return humanOverride;
  } else if (monkey.value !== null) {
    return monkey.value;
  } else {
    const arg1: number = getMonkeyNumber(monkey.args[0], monkeys, humanOverride);
    const arg2: number = getMonkeyNumber(monkey.args[1], monkeys, humanOverride);
    switch (monkey.op) {
      case '*':
        return arg1 * arg2;
      case '+':
        return arg1 + arg2;
      case '-':
        return arg1 - arg2;
      case '/':
        return Math.floor(arg1 / arg2);
      default:
        throw new Error('unrecognized op');
    }
  }
}

export function findRootNumber(input: string[]): number {
  const monkeys: { [name: string]: Monkey } = parseMonkeys(input);
  return getMonkeyNumber('root', monkeys);
}

export function findNumberToYell(input: string[]): number {
  const monkeys: { [name: string]: Monkey } = parseMonkeys(input);
  const rootMonkey: Monkey = monkeys['root'];
  let arg1: number = getMonkeyNumber(rootMonkey.args[0], monkeys, 0);
  const arg2: number = getMonkeyNumber(rootMonkey.args[1], monkeys, 0);
  const initialSign = Math.sign(arg1 - arg2);

  let base: number = 0;
  while (true) {
    let factor: number = 1;
    while (true) {
      let numberToYell: number = base + factor;
      arg1 = getMonkeyNumber(rootMonkey.args[0], monkeys, numberToYell);
      if (arg1 === arg2) {
        return numberToYell;
      } else if (Math.sign(arg1 - arg2) !== initialSign) {
        break;
      }
      factor = factor * 2;
    }
    base = base + Math.floor(factor / 2);
  }
}
