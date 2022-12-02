function parseElves(input: string[]): number[] {
  let elves: number[] = [0];
  let elfIndex: number = 0;

  for (let line of input) {
    if (line === '') {
      elfIndex++;
      elves.push(0);
      continue;
    } else {
      let calories: number = parseInt(line);
      elves[elfIndex] += calories;
    }
  }

  return elves;
}

export function findMaxCalories(input: string[]): number {
  let elves: number[] = parseElves(input);
  return Math.max(...elves);
}

export function findTotalTop3Calories(input: string[]): number {
  let elves: number[] = parseElves(input);
  let sorted_elves: number[] = elves.sort((a: number, b: number) => b - a);
  return sorted_elves[0] + sorted_elves[1] + sorted_elves[2];
}
