import { mod } from "./mod";

const MAX_QUEUE_SIZE: number = 1000000;

export class Queue<T> {
  data: T[];
  head: number;
  size: number;
  capacity: number;

  constructor(capacity: number = MAX_QUEUE_SIZE) {
    this.data = [];
    this.head = 0;
    this.size = 0;
    this.capacity = capacity;
  }

  push(e: T) {
    if (this.size === this.capacity) {
      throw new Error('Queue is full');
    }

    this.data[mod(this.head + this.size, this.capacity)] = e;
    this.size++;
  }

  pop(): T {
    if (this.size === 0) {
      throw new Error('Queue is empty');
    }

    const res: T = this.data[this.head];
    this.head = mod(this.head + 1, this.capacity);
    this.size--;
    return res;
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
