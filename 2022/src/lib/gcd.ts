export function gcd(a: number, b: number): number {
  while (b > 0) {
    const r: number = a % b;
    a = b;
    b = r;
  }

  return a;
}

export function lcm(a: number, b: number): number {
  return a * b / gcd(a, b);
}
