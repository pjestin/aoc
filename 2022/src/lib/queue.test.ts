import { Queue } from "./queue";

describe('Queue', () => {
  test('push', () => {
    let queue: Queue<string> = new Queue;
    queue.push('ab');
    queue.push('cd');
    expect(queue.size).toBe(2);
  });

  test('pop', () => {
    let queue: Queue<string> = new Queue;
    expect(() => queue.pop()).toThrowError('Queue is empty');
    queue.push('ab');
    queue.push('cd');
    expect(queue.pop()).toBe('ab');
    expect(queue.pop()).toBe('cd');
    expect(queue.size).toBe(0);
    expect(() => queue.pop()).toThrowError('Queue is empty');
  });

  test('isEmpty', () => {
    let queue: Queue<string> = new Queue;
    queue.push('ab');
    queue.push('cd');
    expect(queue.isEmpty()).toBe(false);
    expect(queue.pop()).toBe('ab');
    expect(queue.pop()).toBe('cd');
    expect(queue.isEmpty()).toBe(true);
  });

  test('peek', () => {
    let queue: Queue<string> = new Queue;
    expect(() => queue.peek()).toThrowError('Queue is empty');
    queue.push('ab');
    expect(queue.peek()).toBe('ab');
    queue.push('cd');
    expect(queue.peek()).toBe('ab');
    expect(queue.pop()).toBe('ab');
    expect(queue.peek()).toBe('cd');
    expect(queue.pop()).toBe('cd');
    expect(() => queue.peek()).toThrowError('Queue is empty');
  });
});
