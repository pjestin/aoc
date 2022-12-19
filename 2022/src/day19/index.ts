import { Queue } from "../lib/queue";

const BLUEPRINT_PATTERN: RegExp = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
const MINERALS: ('ore' | 'clay' | 'obsidian' | 'geode')[] = ['geode', 'obsidian', 'clay', 'ore'];
const MAX_TIME: number = 24;
const MAX_TIME_HUNGRY: number = 32;

class RobotCost {
  ore: number;
  clay: number;
  obsidian: number;

  constructor(ore: number, clay: number, obsidian: number) {
    this.ore = ore;
    this.clay = clay;
    this.obsidian = obsidian;
  }
}

class Blueprint {
  id: number;
  cost: { ore: RobotCost, clay: RobotCost, obsidian: RobotCost, geode: RobotCost };

  constructor(id: number, cost: { ore: RobotCost, clay: RobotCost, obsidian: RobotCost, geode: RobotCost }) {
    this.id = id;
    this.cost = cost;
  }
}

class State {
  time: number;
  minerals: { ore: number, clay: number, obsidian: number, geode: number };
  robots: { ore: number, clay: number, obsidian: number, geode: number };

  constructor(time: number, minerals: { ore: number, clay: number, obsidian: number, geode: number }, robots: { ore: number, clay: number, obsidian: number, geode: number }) {
    this.time = time;
    this.minerals = minerals;
    this.robots = robots;
  }

  hash(): string {
    return `${Object.entries(this.minerals).map(mineral => mineral.toString()).sort().join(';')}-${Object.entries(this.robots).map(mineral => mineral.toString()).sort().join(';')}`;
  }
}

function parseBlueprints(input: string[]): Blueprint[] {
  return input.map(line => {
    const m: RegExpMatchArray | null = line.match(BLUEPRINT_PATTERN);
    if (!m) {
      throw new Error('Line does not match');
    }
    return new Blueprint(
      parseInt(m[1]),
      {
        ore: new RobotCost(parseInt(m[2]), 0, 0),
        clay: new RobotCost(parseInt(m[3]), 0, 0),
        obsidian: new RobotCost(parseInt(m[4]), parseInt(m[5]), 0),
        geode: new RobotCost(parseInt(m[6]), 0, parseInt(m[7])),
      },
    );
  });
}

function findMaxGeodes(blueprint: Blueprint, maxTime: number): number {
  let maxGeode: number = 0;
  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue(100000000);
  queue.push(new State(0, { ore: 0, clay: 0, obsidian: 0, geode: 0 }, { ore: 1, clay: 0, obsidian: 0, geode: 0 }));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();
    const stateHash: string = state.hash();
    // console.log(stateHash)

    // maxGeode = Math.max(maxGeode, state.minerals.geode + state.robots.geode * (maxTime - state.time));
    if (state.minerals.geode + state.robots.geode * (maxTime - state.time) > maxGeode) {
      maxGeode = state.minerals.geode + state.robots.geode * (maxTime - state.time);
      console.log('New max:', maxGeode, '; state:', state);
    }

    if (state.time >= maxTime - 1 || visited.has(stateHash)) {
      continue;
    }

    visited.add(stateHash);

    let atLeastOneRobotTooExpensive: boolean = false;
    let robotContructionCount: number = 0;
    for (const mineral of MINERALS) {
      if ((mineral === 'ore' && state.time > maxTime / 2)
        || (mineral === 'geode' && state.time < maxTime / 2)
        || (mineral === 'clay' && state.time > 3 * maxTime / 4)
        || (mineral === 'obsidian' && state.time < maxTime / 4)
      ) {
        continue;
      }

      const cost: RobotCost = blueprint.cost[mineral];
      if (state.minerals.ore < cost.ore || state.minerals.clay < cost.clay || state.minerals.obsidian < cost.obsidian) {
        atLeastOneRobotTooExpensive = true;
        continue;
      }

      queue.push(new State(
        state.time + 1,
        {
          ore: state.minerals.ore - cost.ore + state.robots.ore,
          clay: state.minerals.clay - cost.clay + state.robots.clay,
          obsidian: state.minerals.obsidian - cost.obsidian + state.robots.obsidian,
          geode: state.minerals.geode + state.robots.geode,
        },
        {
          ...state.robots,
          [mineral]: state.robots[mineral] + 1
        },
      ));

      robotContructionCount++;
      if (robotContructionCount >= 2) {
        break;
      }
      // console.log('New state:', queue.peek())
    }

    if (atLeastOneRobotTooExpensive) {
      queue.push(new State(
        state.time + 1,
        {
          ore: state.minerals.ore + state.robots.ore,
          clay: state.minerals.clay + state.robots.clay,
          obsidian: state.minerals.obsidian + state.robots.obsidian,
          geode: state.minerals.geode + state.robots.geode,
        },
        state.robots,
      ));
    }
  }

  console.log('Blueprint ID:', blueprint.id, '; max geodes:', maxGeode);
  return maxGeode;
}

export function sumQualityLevels(input: string[]): number {
  const blueprints: Blueprint[] = parseBlueprints(input);
  let qualityLevelSum: number = 0;

  for (const blueprint of blueprints) {
    qualityLevelSum += blueprint.id * findMaxGeodes(blueprint, MAX_TIME);
  }

  return qualityLevelSum;
}

export function multiplyTopGeodes(input: string[]): number {
  const blueprints: Blueprint[] = parseBlueprints(input).slice(0, 3);

  return blueprints.map(blueprint => findMaxGeodes(blueprint, MAX_TIME_HUNGRY)).reduce((acc, geodes) => acc * geodes, 1);
}
