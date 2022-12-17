import { Queue } from "../lib/queue";

const VALVE_PATTERN: RegExp = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.*)/;
const MAX_TIME: number = 30;
const MAX_TIME_WITH_ELEPHANT: number = 26;
const FIRST_VALVE: string = 'AA';

class Valve {
  name: string;
  rate: number;
  destinations: string[];

  constructor(name: string, rate: number, destinations: string[]) {
    this.name = name;
    this.rate = rate;
    this.destinations = destinations;
  }

  toString() {
    return `${this.name}; rate: ${this.rate}; destinations: ${this.destinations}`;
  }
}

class State {
  time: number;
  valve: string;
  rate: number;
  pressure: number;
  openValves: string[];
  combination: string;

  constructor(time: number, valve: string, rate: number, pressure: number, openValves: string[], combination: string) {
    this.time = time;
    this.valve = valve;
    this.rate = rate;
    this.pressure = pressure;
    this.openValves = openValves;
    this.combination = combination;
  }

  toString() {
    return `${this.valve};${this.openValves}`;
  }
}

function parseGraph(input: string[]): { [name: string]: Valve } {
  let graph: { [name: string]: Valve } = {};

  for (const line of input) {
    const m = line.match(VALVE_PATTERN);
    if (!m) {
      throw new Error('No regex match');
    }
    const destinations: string[] = m[3].split(', ');
    graph[m[1]] = new Valve(m[1], parseInt(m[2]), destinations);
  }

  return graph;
}

function findMostPressurePerCombination(graph: { [name: string]: Valve }, maxTime: number): { [combination: string]: number } {
  const nOpenableValves: number = Object.values(graph).filter(valve => valve.rate > 0).length;
  let combinations: { [combination: string]: number } = {};

  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue(100000000);
  queue.push(new State(0, FIRST_VALVE, 0, 0, [], ''));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();

    combinations[state.combination] = Math.max(combinations[state.combination] || 0, state.pressure + (maxTime - state.time) * state.rate);

    if (state.time === maxTime
      || state.openValves.length >= nOpenableValves
      || visited.has(state.toString())
    ) {
      continue;
    }

    visited.add(state.toString());

    if (!state.openValves.includes(state.valve) && graph[state.valve].rate > 0) {
      queue.push(new State(
        state.time + 1,
        state.valve,
        state.rate + graph[state.valve].rate,
        state.pressure + state.rate,
        [...state.openValves, state.valve],
        [...state.openValves, state.valve].sort().join(';'),
      ));
    }

    for (const destination of graph[state.valve].destinations) {
      queue.push(new State(
        state.time + 1,
        destination,
        state.rate,
        state.pressure + state.rate,
        state.openValves,
        state.combination,
      ));
    }
  }

  return combinations;
}

export function findMostPressure(input: string[]): number {
  const graph: { [name: string]: Valve } = parseGraph(input);

  const combinations: { [combination: string]: number } = findMostPressurePerCombination(graph, MAX_TIME);

  return Math.max(...Object.values(combinations));
}

function areCombinationsCompatible(combination1: string, combination2: string): boolean {
  for (const valve of combination1.split(';')) {
    if (combination2.includes(valve)) {
      return false;
    }
  }
  return true;
}

export function findMostPressureWithElephant(input: string[]): number {
  const graph: { [name: string]: Valve } = parseGraph(input);
  const combinations: { [combination: string]: number } = findMostPressurePerCombination(graph, MAX_TIME_WITH_ELEPHANT);
  const combinationKeys: string[] = Object.keys(combinations);
  let maxPressure: number = 0;

  for (let i = 0; i < combinationKeys.length; i++) {
    for (let j = i + 1; j < combinationKeys.length; j++) {
      const combination1: string = combinationKeys[i];
      const combination2: string = combinationKeys[j];
      if (areCombinationsCompatible(combination1, combination2)) {
        maxPressure = Math.max(maxPressure, combinations[combination1] + combinations[combination2]);
      }
    }
  }

  return maxPressure;
}
