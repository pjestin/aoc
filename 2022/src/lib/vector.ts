export class Vector {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  add(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    this.z += other.z;
    return this;
  }

  distance(other: Vector): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y) + Math.abs(this.z - other.z);
  }

  toString(): string {
    return `${this.x},${this.y},${this.z}`;
  }

  static fromString(s: string): Vector {
    const [x, y, z]: number[] = s.split(',').map(i => parseInt(i));
    return new Vector(x, y, z || 0);
  }
}
