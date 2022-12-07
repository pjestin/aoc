const MAXIMUM_DIR_SIZE: number = 100000;
const FILE_SYSTEM_CAPACITY: number = 70000000;
const UNUSED_SPACE_NEEDED: number = 30000000;

class Dir {
  name: string;
  dirs: { [name: string]: Dir };
  files: { [name: string]: File };
  parent: Dir | null;

  constructor(name: string, parent: Dir | null) {
    this.name = name;
    this.dirs = {};
    this.files = {};
    this.parent = parent;
  }

  getSize(): number {
    const dirSize: number = Object.values(this.dirs).map(dir => dir.getSize()).reduce((acc, size) => acc + size, 0);
    const fileSize: number = Object.values(this.files).map(file => file.size).reduce((acc, size) => acc + size, 0);
    return dirSize + fileSize;
  }

  toString(): string {
    return 'Name: ' + this.name + '; dirs: ' + JSON.stringify(this.dirs) + '; files: ' + JSON.stringify(this.files);
  }
}

class File {
  name: string;
  size: number;

  constructor(name: string, size: number) {
    this.name = name;
    this.size = size;
  }
}

function parseFileTree(input: string[]): Dir {
  let rootDir: Dir = new Dir('/', null);
  let currentDir: Dir = rootDir;
  for (const line of input) {
    const splitLine: string[] = line.split(' ');
    if (splitLine[0] === '$') {
      if (splitLine[1] === 'cd') {
        if (splitLine[2] === '..') {
          currentDir = currentDir.parent as Dir;
        } else if (splitLine[2] !== '/') {
          currentDir = currentDir.dirs[splitLine[2]];
        }
      }
    } else {
      if (splitLine[0] === 'dir') {
        currentDir.dirs[splitLine[1]] = new Dir(splitLine[1], currentDir);
      } else {
        currentDir.files[splitLine[1]] = new File(splitLine[1], parseInt(splitLine[0]));
      }
    }
  }
  return rootDir;
}

function sumDirSizes(dir: Dir): number {
  const subTreeSizes: number = Object.values(dir.dirs).map(sumDirSizes).reduce((acc, size) => acc + size, 0);
  const dirSize = dir.getSize();
  if (dirSize <= MAXIMUM_DIR_SIZE) {
    return dirSize + subTreeSizes;
  } else {
    return subTreeSizes;
  }
}

export function findDirectorySizes(input: string[]): number {
  const fileTree: Dir = parseFileTree(input);
  return sumDirSizes(fileTree);
}

function findApprioriateDirSize(currentDir: Dir, additionalSizeNeeded: number): number {
  const dirSizes: number[] = Object.values(currentDir.dirs).map(dir => findApprioriateDirSize(dir, additionalSizeNeeded));
  const dirSizesIncludingCurrent: number[] = dirSizes.concat(currentDir.getSize());
  return Math.min(...dirSizesIncludingCurrent.filter(size => size >= additionalSizeNeeded));
}

export function findDirectoryToDelete(input: string[]): number {
  const fileTree: Dir = parseFileTree(input);
  const totalSize: number = fileTree.getSize();
  const additionalSizeNeeded: number = UNUSED_SPACE_NEEDED - FILE_SYSTEM_CAPACITY + totalSize;
  return findApprioriateDirSize(fileTree, additionalSizeNeeded);
}
