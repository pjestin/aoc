import { Stack } from './stack';

describe('Stack', () => {
  test('push', () => {
    let stack: Stack<string> = new Stack();
    stack.push('a');
    stack.push('b');
    stack.push('c');
  });

  test('pop', () => {
    let stack: Stack<string> = new Stack();
    stack.push('a');
    stack.push('b');
    stack.push('c');
    expect(stack.pop()).toBe('c');
    expect(stack.pop()).toBe('b');
    expect(stack.pop()).toBe('a');
    expect(() => stack.pop()).toThrowError('stack is empty');
  });

  test('peek', () => {
    let stack: Stack<string> = new Stack();
    expect(() => stack.peek()).toThrowError('stack is empty');
    stack.push('a');
    stack.push('b');
    stack.push('c');
    expect(stack.peek()).toBe('c');
  });

  test('with numbers', () => {
    let stack: Stack<number> = new Stack();
    stack.push(556);
    expect(stack.pop()).toBe(556);
  });

  test('isEmpty', () => {
    let stack: Stack<string> = new Stack();
    expect(stack.isEmpty()).toBe(true);
    stack.push('a');
    expect(stack.isEmpty()).toBe(false);
    stack.pop();
    expect(stack.isEmpty()).toBe(true);
  });
});
