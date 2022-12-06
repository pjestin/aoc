export class Stack<T> {
  data: T[];
  size: number;

  constructor() {
    this.data = [];
    this.size = 0;
  }

  push(e: T) {
    this.data[this.size] = e;
    this.size += 1;
  }

  pop(): T {
    if (this.size === 0) {
      throw new Error('stack is empty');
    }
    this.size -= 1;
    return this.data[this.size];
  }

  peek(): T {
    if (this.size === 0) {
      throw new Error('stack is empty');
    }
    return this.data[this.size - 1];
  }

  toString(): string {
    return '(' + this.data.slice(0, this.size).join(', ') + ')';
  }
}
