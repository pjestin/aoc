export class Stack {
  data: string[];
  size: number;

  constructor() {
    this.data = [];
    this.size = 0;
  }

  push(e: string) {
    this.data[this.size] = e;
    this.size += 1;
  }

  pop(): string {
    if (this.size === 0) {
      throw new Error('stack is empty');
    }
    this.size -= 1;
    return this.data[this.size];
  }

  peek(): string {
    if (this.size === 0) {
      throw new Error('stack is empty');
    }
    return this.data[this.size - 1];
  }

  toString(): string {
    return '(' + this.data.slice(0, this.size).join(', ') + ')';
  }
}
