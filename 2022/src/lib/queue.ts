export class Queue<T> {
  data: T[];
  head: number;
  size: number;

  constructor() {
    this.data = [];
    this.head = -1;
    this.size = 0;
  }

  push(e: T) {
    this.data[this.head + this.size] = e;
    this.size++;
  }

  pop(): T {
    if (this.size === 0) {
      throw new Error('Queue is empty');
    }

    this.head++;
    this.size--;
    return this.data[this.head - 1];
  }

  peek(): T {
    if (this.size === 0) {
      throw new Error('Queue is empty');
    }

    return this.data[this.head];
  }

  isEmpty(): boolean {
    return this.size === 0;
  }
}
