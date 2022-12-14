import { Vector } from './vector';

describe('Vector', () => {
  test('equals', () => {
    const a: Vector = new Vector(12, -3);
    const b: Vector = new Vector(-1, -405);
    const c: Vector = new Vector(12, -405);
    const d: Vector = new Vector(12, -3);
    expect(a.equals(b)).toBe(false);
    expect(a.equals(c)).toBe(false);
    expect(a.equals(d)).toBe(true);
  });

  test('add', () => {
    const a: Vector = new Vector(12, -3);
    const b: Vector = new Vector(-1, -405);
    expect(a.add(b)).toEqual(new Vector(11, -408));
  });

  test('distance', () => {
    const a: Vector = new Vector(12, -3, 89);
    const b: Vector = new Vector(-1, -405, 45);
    expect(a.distance(b)).toBe(459);
  });

  test('toString', () => {
    const v: Vector = new Vector(12, -3);
    expect(v.toString()).toBe('12,-3,0');
  });

  test('fromString', () => {
    const v: Vector = new Vector(12, -3);
    const s: string = v.toString();
    expect(Vector.fromString(s)).toEqual(v);
  });

  test('fromString - 3D', () => {
    const v: Vector = new Vector(12, -3, -46);
    const s: string = v.toString();
    expect(Vector.fromString(s)).toEqual(v);
  });
});
