import { gcd, lcm } from './gcd';

describe('gcd', () => {
  test('gcd', () => {
    expect(gcd(3, 5)).toBe(1);
    expect(gcd(15, 30)).toBe(15);
    expect(gcd(20, 45)).toBe(5);
  });
});

describe('lcm', () => {
  test('lcm', () => {
    expect(lcm(3, 5)).toBe(15);
    expect(lcm(15, 30)).toBe(30);
    expect(lcm(20, 45)).toBe(180);
  });
});
