import { mod } from "../lib/mod";

function fromSnafu(snafu: string): number {
  let decimal: number = 0;
  let factor: number = 1;

  for (let i = snafu.length - 1; i >= 0; i--) {
    const c = snafu.charAt(i);

    switch (c) {
      case '-':
        decimal -= factor;
        break;
      case '=':
        decimal -= 2 * factor;
        break;
      default:
        decimal += parseInt(c) * factor;
        break;
    }

    factor *= 5;
  }

  return decimal;
}

function toSnafu(decimal: number): string {
  let snafu: string = '';

  while (decimal !== 0) {
    decimal += 2;

    switch (mod(decimal, 5)) {
      case 0:
        snafu = `=${snafu}`;
        break;
      case 1:
        snafu = `-${snafu}`;
        break;
      default:
        snafu = `${mod(decimal, 5) - 2}${snafu}`;
        break;
    }

    decimal = Math.floor(decimal / 5);
  }

  return snafu;
}

export function sumSnafuNumbers(input: string[]): string {
  const decimals: number[] = input.map(fromSnafu);
  const sum: number = decimals.reduce((acc, dec) => acc + dec, 0);
  return toSnafu(sum);
}
