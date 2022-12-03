function findCommonItem(groups: string[]): string {
  const sets: Set<string>[] = groups.map(group => new Set(group.split('')));
  const commonItems: string[] = [...sets[0]].filter(item => {
    return sets.map(set => set.has(item)).reduce((acc, hasItem) => acc && hasItem);
  });

  if (commonItems.length !== 1) {
    throw new Error('Not exactly 1 common item');
  }

  return commonItems[0];
}

function findCompartmentCommonItem(rucksack: string): string {
  const firstHalf: string = rucksack.substring(0, Math.floor(rucksack.length / 2));
  const secondHalf: string = rucksack.substring(Math.floor(rucksack.length / 2), rucksack.length);
  return findCommonItem([firstHalf, secondHalf]);
}

function getPriority(item: string): number {
  const asciiCode: number = item.charCodeAt(0);
  if (asciiCode >= 65 && asciiCode <= 90) {
    return asciiCode - 38;
  } else if (asciiCode >= 97 && asciiCode <= 122) {
    return asciiCode - 96;
  } else {
    throw new Error('Unrecognized item: ' + item);
  }
}

export function sumCompartmentPriorities(input: string[]): number {
  return input.map(findCompartmentCommonItem).map(getPriority).reduce((acc, priority) => acc + priority);
}

function findGroupCommonItem(groups: string[]): string {
  if (groups.length !== 3) {
    throw new Error('Length invalid for groups');
  }

  return findCommonItem(groups);
}

export function sumGroupPriorities(input: string[]): number {
  let sum: number = 0;
  for (let groupIndex = 0; groupIndex < Math.floor(input.length / 3); groupIndex++) {
    const groupCommonItem: string = findGroupCommonItem(input.slice(groupIndex * 3, (groupIndex + 1) * 3));
    sum += getPriority(groupCommonItem);
  }
  return sum;
}
