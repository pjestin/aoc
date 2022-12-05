import { Stack } from './stack';

describe('Stack', () => {
  test('push', () => {
    let stack = new Stack();
    stack.push('a');
    stack.push('b');
    stack.push('c');
  });

  test('pop', () => {
    let stack = new Stack();
    stack.push('a');
    stack.push('b');
    stack.push('c');
    expect(stack.pop()).toBe('c');
    expect(stack.pop()).toBe('b');
    expect(stack.pop()).toBe('a');
    expect(() => stack.pop()).toThrowError('stack is empty');
  });

  test('peek', () => {
    let stack = new Stack();
    expect(() => stack.peek()).toThrowError('stack is empty');
    stack.push('a');
    stack.push('b');
    stack.push('c');
    expect(stack.peek()).toBe('c');
  });
});
