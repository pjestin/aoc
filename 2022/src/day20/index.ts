import { mod } from "../lib/mod";

const RESULT_INDICES: number[] = [1000, 2000, 3000];

function mix(file: number[], indices: number[]): void {
  for (let i = 0; i < file.length; i++) {
    const n: number = file[i];
    const index: number = indices.indexOf(i);
    const newIndex: number = mod(index + n - 1, file.length - 1) + 1;
    if (newIndex > index) {
      for (let j = index; j < newIndex; j++) {
        indices[j] = indices[j + 1];
      }
    } else {
      for (let j = index; j > newIndex; j--) {
        indices[j] = indices[j - 1];
      }
    }
    indices[newIndex] = i;
  }
}

export function findGroveCoordinates(input: string[], mixTimes: number, decryptionKey: number): number {
  const file: number[] = input.map(x => decryptionKey * parseInt(x));
  let indices: number[] = [...Array(file.length).keys()];

  for (let k = 0; k < mixTimes; k++) {
    mix(file, indices);
  }

  const mixedFile = indices.map(index => file[index]);
  const index0: number = mixedFile.indexOf(0);
  return RESULT_INDICES
    .map(index => mixedFile[mod(index0 + index, file.length)])
    .reduce((acc, x) => acc + x, 0);
}
