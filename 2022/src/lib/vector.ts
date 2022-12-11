export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  equals(other: Vector): boolean {
    return this.x === other.x && this.y === other.y;
  }

  add(other: Vector): Vector {
    this.x += other.x;
    this.y += other.y;
    return this;
  }

  distance(other: Vector): number {
    return Math.abs(this.x - other.x) + Math.abs(this.y - other.y);
  }

  toString(): string {
    return this.x + ';' + this.y;
  }
}
