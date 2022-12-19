import { Queue } from "../lib/queue";

const BLUEPRINT_PATTERN: RegExp = /Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./;
const MINERALS: ('ore' | 'clay' | 'obsidian' | 'geode')[] = ['ore', 'clay', 'obsidian', 'geode'];
const MAX_TIME: number = 24;

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
        ore:  new RobotCost(parseInt(m[2]), 0, 0),
        clay: new RobotCost(parseInt(m[3]), 0, 0),
        obsidian: new RobotCost(parseInt(m[4]), parseInt(m[5]), 0),
        geode: new RobotCost(parseInt(m[6]), 0, parseInt(m[7])),
      },
    );
  });
}

function getStateHash(state: State): string {
  return `${Object.entries(state.minerals).map(mineral => mineral.toString()).sort().join(';')}-${Object.entries(state.robots).map(mineral => mineral.toString()).sort().join(';')}`;
}

export function sumQualityLevels(input: string[]): number {
  const blueprints: Blueprint[] = parseBlueprints(input);
  let qualityLevelSum: number = 0;

  for (const blueprint of blueprints) {
    let maxGeode: number = 0;
    let maxTime: number = 0;
    let visited: Set<string> = new Set;
    let queue: Queue<State> = new Queue(10000000);
    queue.push(new State(0, { ore: 0, clay: 0, obsidian: 0, geode: 0 }, { ore: 1, clay: 0, obsidian: 0, geode: 0 }));

    while (!queue.isEmpty()) {
      const state: State = queue.pop();
      const stateHash: string = getStateHash(state);
      // console.log(stateHash)

      // maxGeode = Math.max(maxGeode, state.minerals.geode + state.robots.geode * (MAX_TIME - state.time));
      if (state.minerals.geode + state.robots.geode * (MAX_TIME - state.time) > maxGeode) {
        maxGeode = state.minerals.geode + state.robots.geode * (MAX_TIME - state.time);
        console.log('New max:', maxGeode, '; state:', state);
      }

      if (state.time > maxTime) {
        maxTime = state.time;

      }

      if (state.time >= MAX_TIME || visited.has(stateHash)) {
        continue;
      }

      visited.add(stateHash);

      let atLeastOneRobotTooExpensive: boolean = false;
      for (const mineral of MINERALS) {
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

    qualityLevelSum += blueprint.id * maxGeode;
  }

  return qualityLevelSum;
}
