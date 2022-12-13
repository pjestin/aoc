enum Correctness {
  Correct,
  Wrong,
  Undetermined,
}

function parsePairs(input: string[]): [any, any][] {
  let pairs: [any, any][] = [];
  let pair = [];

  for (const line of input) {
    if (line === '') {
      pairs.push(pair as [any, any]);
      pair = [];
    } else {
      pair.push(JSON.parse(line));
    }
  }
  pairs.push(pair as [any, any]);

  return pairs;
}

function correctnessFromNumbers(left: number, right: number): Correctness {
  if (left < right) {
    return Correctness.Correct;
  } else if (left === right) {
    return Correctness.Undetermined;
  } else {
    return Correctness.Wrong;
  }
}

function isPairCorrect(pair: [any, any]): Correctness {
  let left: any = pair[0];
  let right: any = pair[1];

  if (typeof left === 'number' && typeof right === 'number') {
    return correctnessFromNumbers(left, right);
  }
  if (typeof left === 'number') {
    left = [left];
  }
  if (typeof right === 'number') {
    right = [right];
  }

  let i: number = 0;
  while (i < left.length && i < right.length) {
    const subPairCorrectness: Correctness = isPairCorrect([left[i], right[i]]);
    if (subPairCorrectness !== Correctness.Undetermined) {
      return subPairCorrectness;
    }
    i++;
  }

  return correctnessFromNumbers(left.length, right.length);
}

export function findCorrectOrderPairs(input: string[]): number {
  const pairs = parsePairs(input);
  let indexSum: number = 0;

  for (let index = 0; index < pairs.length; index++) {
    if (isPairCorrect(pairs[index]) === Correctness.Correct) {
      indexSum += index + 1;
    }
  }

  return indexSum;
}

function packetCompare(left: any, right: any) {
  const correctness: Correctness = isPairCorrect([left, right]);
  switch (correctness) {
    case Correctness.Correct:
      return -1;
    case Correctness.Undetermined:
      return 0;
    case Correctness.Wrong:
      return 1;
  }
}

export function organizePackets(input: string[]): number {
  const pairs = parsePairs(input);

  let packets: any[] = [];
  for (const pair of pairs) {
    packets.push(pair[0]);
    packets.push(pair[1]);
  }
  packets.push([[2]]);
  packets.push([[6]]);
  packets.sort(packetCompare);

  let result: number = 1;
  for (let i = 0; i < packets.length; i++) {
    const packetString = JSON.stringify(packets[i]);
    if (packetString === '[[2]]' || packetString === '[[6]]') {
      result *= (i + 1);
    }
  }
  return result;
}
