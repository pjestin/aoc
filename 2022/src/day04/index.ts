class Assignment {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}

function parsePair(line: string): Assignment[] {
  const pair: string[] = line.split(',');
  const elf1: string[] = pair[0].split('-');
  const elf2: string[] = pair[1].split('-');

  return [
    new Assignment(parseInt(elf1[0]), parseInt(elf1[1])),
    new Assignment(parseInt(elf2[0]), parseInt(elf2[1])),
  ]
}

export function countIncludePairs(input: string[]): number {
  return input.filter(line => {
    const pair: Assignment[] = parsePair(line);
    return (pair[0].start >= pair[1].start && pair[0].end <= pair[1].end) || (pair[1].start >= pair[0].start && pair[1].end <= pair[0].end);
  }).length;
}

export function countOverlappingPairs(input: string[]): number {
  return input.filter(line => {
    const pair: Assignment[] = parsePair(line);
    return pair[0].end >= pair[1].start && pair[0].start <= pair[1].end;
  }).length;
}
