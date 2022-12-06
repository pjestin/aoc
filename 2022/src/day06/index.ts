export function findFirstStart(input: string, distinct: number): number {
  for (let i = distinct; i <= input.length; i++) {
    let characters: Set<string> = new Set(input.slice(i - distinct, i).split(''));
    if (characters.size === distinct) {
      return i;
    }
  }
  throw new Error('No start of packet found');
}
