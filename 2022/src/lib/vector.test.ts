import { Vector } from './vector';

describe('Vector', () => {
  test('toString', () => {
    const v: Vector = new Vector(12, -3);
    expect(v.toString()).toBe('12;-3');
  });
});
