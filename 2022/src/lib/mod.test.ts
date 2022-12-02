import { mod } from './mod';

describe('mod', () => {
  test('mod', () => {
    expect(mod(2, 3)).toBe(2);
    expect(mod(-2, 3)).toBe(1);
    expect(mod(-4, 3)).toBe(2);
  });
});
