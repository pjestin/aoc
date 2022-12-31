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
  remainingTime: number;
  minerals: { ore: number, clay: number, obsidian: number, geode: number };
  robots: { ore: number, clay: number, obsidian: number, geode: number };

  constructor(remainingTime: number, minerals: { ore: number, clay: number, obsidian: number, geode: number }, robots: { ore: number, clay: number, obsidian: number, geode: number }) {
    this.remainingTime = remainingTime;
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

function notEnoughGeodes(state: State, maxGeode: number): boolean {
  return state.minerals.geode + state.robots.geode * state.remainingTime + Math.floor((state.remainingTime * (state.remainingTime + 1)) / 2) <= maxGeode;
}

function findMaxGeodes(blueprint: Blueprint, maxTime: number): number {
  const maxRobotCost: RobotCost = new RobotCost(
    Math.max(blueprint.cost.ore.ore, blueprint.cost.clay.ore, blueprint.cost.obsidian.ore, blueprint.cost.geode.ore),
    Math.max(blueprint.cost.ore.clay, blueprint.cost.clay.clay, blueprint.cost.obsidian.clay, blueprint.cost.geode.clay),
    Math.max(blueprint.cost.ore.obsidian, blueprint.cost.clay.obsidian, blueprint.cost.obsidian.obsidian, blueprint.cost.geode.obsidian),
  );

  let maxGeode: number = 0;
  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue(100000000);
  queue.push(new State(maxTime, { ore: 0, clay: 0, obsidian: 0, geode: 0 }, { ore: 1, clay: 0, obsidian: 0, geode: 0 }));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();
    const stateHash: string = state.hash();

    maxGeode = Math.max(maxGeode, state.minerals.geode + state.robots.geode * state.remainingTime);

    if (state.remainingTime <= 1
      || visited.has(stateHash)
      || notEnoughGeodes(state, maxGeode)
    ) {
      continue;
    }

    visited.add(stateHash);

    let atLeastOneRobotTooExpensive: boolean = false;
    let robotContructionCount: number = 0;
    for (const mineral of MINERALS) {
      if ((mineral === 'ore' && state.remainingTime < maxTime / 2)
        || (mineral === 'geode' && state.remainingTime > maxTime / 2)
        || (mineral === 'clay' && state.remainingTime < maxTime / 4)
        || (mineral === 'obsidian' && state.remainingTime > 3 * maxTime / 4)
      ) {
        continue;
      }

      const cost: RobotCost = blueprint.cost[mineral];
      if (state.minerals.ore < cost.ore
        || state.minerals.clay < cost.clay
        || state.minerals.obsidian < cost.obsidian
        || (mineral !== 'geode' && state.robots[mineral] >= maxRobotCost[mineral])
      ) {
        atLeastOneRobotTooExpensive = true;
        continue;
      }

      queue.push(new State(
        state.remainingTime - 1,
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
      if (robotContructionCount >= 2 || mineral === 'geode') {
        break;
      }
    }

    if (atLeastOneRobotTooExpensive && robotContructionCount < 2) {
      queue.push(new State(
        state.remainingTime - 1,
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

export function multiplyFirstGeodes(input: string[]): number {
  const blueprints: Blueprint[] = parseBlueprints(input).slice(0, 3);
  return blueprints.map(blueprint => findMaxGeodes(blueprint, MAX_TIME_HUNGRY)).reduce((acc, geodes) => acc * geodes, 1);
}
