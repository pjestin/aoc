class ListNode {
  value: number;
  previous: ListNode;
  next: ListNode;

  constructor(value: number, previous: ListNode | null = null, next: ListNode | null = null) {
    this.value = value;
    this.previous = previous || this;
    this.next = next || this;
  }

  size(): number {
    let currentNode: ListNode = this.next;
    let i: number = 0;
    while (currentNode !== this) {
      currentNode = currentNode.next;
      i++;
    }
    return i + 1;
  }
}

function fromFile(file: number[]): ListNode {
  let tail: ListNode = new ListNode(-1);
  for (const n of file) {
    const newNode: ListNode = new ListNode(n, tail.previous, tail);
    tail.previous.next = newNode;
    tail.previous = newNode;
  }
  tail.next.previous = tail.previous;
  tail.previous.next = tail.next;

  let res: ListNode = tail.next;
  while (res.value !== 0) {
    res = res.next;
  }
  return res;
}

function parseEncryptedFile(input: string[]): number[] {
  return input.map(line => parseInt(line));
}

function move(n: number, currentNode: ListNode, nodeToMove: ListNode): void {
  while (n !== 0) {
    if (n > 0) {
      currentNode = currentNode.next;
      n--;
    } else {
      currentNode = currentNode.previous;
      n++;
    }
  }

  nodeToMove.next = currentNode.next;
  nodeToMove.previous = currentNode;
  currentNode.next.previous = nodeToMove;
  currentNode.next = nodeToMove;
}

function mix(n: number, currentNode: ListNode): void {
  let nodeToMove: ListNode = currentNode;
  while (nodeToMove.value !== n) {
    nodeToMove = nodeToMove.next;
  }

  nodeToMove.previous.next = nodeToMove.next;
  nodeToMove.next.previous = nodeToMove.previous;
  move(n, nodeToMove.previous, nodeToMove);
}

function nth(index: number, index0Node: ListNode): number {
  let currentNode: ListNode = index0Node;
  for (let x = 0; x < index; x++) {
    currentNode = currentNode.next;
  }
  return currentNode.value;
}

export function findGroveCoordinates(input: string[]): number {
  const file: number[] = parseEncryptedFile(input);
  let list: ListNode = fromFile(file);

  for (const n of file) {
    mix(n, list);
  }

  return nth(1000, list) + nth(2000, list) + nth(3000, list);
}
