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
  elephantValve: string;
  rate: number;
  pressure: number;
  openValves: string[];
  elephantOpenValves: string[];

  constructor(time: number, valve: string, elephantValve: string, rate: number, pressure: number, openValves: string[], elephantOpenValves: string[]) {
    this.time = time;
    this.valve = valve;
    this.elephantValve = elephantValve;
    this.rate = rate;
    this.pressure = pressure;
    this.openValves = openValves;
    this.elephantOpenValves = elephantOpenValves;
  }

  toString() {
    return `${this.valve};${this.openValves};${this.elephantValve};${this.elephantOpenValves}`;
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

function notEnoughPressure(graph: { [name: string]: Valve }, state: State, maxPressure: number): boolean {
  const remainingRate: number = Object.keys(graph)
    .filter(valve => !state.openValves.includes(valve) && !state.elephantOpenValves.includes(valve))
    .map(closedValve => graph[closedValve].rate)
    .reduce((acc, rate) => acc + rate, 0);
  const rate: number = state.rate + remainingRate;
  const pressure: number = rate * (MAX_TIME - state.time) + state.pressure;
  return pressure <= maxPressure
}

export function findMostPressure(input: string[]): number {
  const graph: { [name: string]: Valve } = parseGraph(input);
  const nOpenableValves: number = Object.values(graph).filter(valve => valve.rate > 0).length;

  let maxPressure: number = 0;
  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue(100000000);
  queue.push(new State(0, FIRST_VALVE, FIRST_VALVE, 0, 0, [], []));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();

    maxPressure = Math.max(maxPressure, state.pressure + (MAX_TIME - state.time) * state.rate);

    if (state.time === MAX_TIME
      || state.openValves.length >= nOpenableValves
      || visited.has(state.toString())
      || notEnoughPressure(graph, state, maxPressure)) {
      continue;
    }

    visited.add(state.toString());

    if (!state.openValves.includes(state.valve) && graph[state.valve].rate > 0) {
      queue.push(new State(
        state.time + 1,
        state.valve,
        state.valve,
        state.rate + graph[state.valve].rate,
        state.pressure + state.rate,
        [...state.openValves, state.valve],
        state.elephantOpenValves,
      ));
    }

    for (const destination of graph[state.valve].destinations) {
      queue.push(new State(
        state.time + 1,
        destination,
        state.elephantValve,
        state.rate,
        state.pressure + state.rate,
        state.openValves,
        state.elephantOpenValves,
      ));
    }
  }

  return maxPressure;
}

export function findMostPressureWithElephant(input: string[]): number {
  const graph: { [name: string]: Valve } = parseGraph(input);
  const nOpenableValves: number = Object.values(graph).filter(valve => valve.rate > 0).length;

  let maxPressure: number = 0;
  let visited: Set<string> = new Set;
  let queue: Queue<State> = new Queue(100000000);
  queue.push(new State(0, FIRST_VALVE, FIRST_VALVE, 0, 0, [], []));

  while (!queue.isEmpty()) {
    const state: State = queue.pop();

    // maxPressure = Math.max(maxPressure, state.pressure + (MAX_TIME_WITH_ELEPHANT - state.time) * state.rate);
    if (state.pressure + (MAX_TIME_WITH_ELEPHANT - state.time) * state.rate > maxPressure) {
      maxPressure = state.pressure + (MAX_TIME_WITH_ELEPHANT - state.time) * state.rate;
      console.log('maxPressure:', maxPressure, '; state:', state)
    }

    if (state.time === MAX_TIME_WITH_ELEPHANT
      || state.openValves.length + state.elephantOpenValves.length >= nOpenableValves
      || visited.has(state.toString())
      || notEnoughPressure(graph, state, maxPressure)) {
      continue;
    }

    visited.add(state.toString());

    if (state.valve !== state.elephantValve
      && !state.openValves.includes(state.valve) && !state.openValves.includes(state.elephantValve)
      && !state.elephantOpenValves.includes(state.valve) && !state.elephantOpenValves.includes(state.elephantValve)
      && graph[state.valve].rate > 0 && graph[state.elephantValve].rate > 0) {
      queue.push(new State(
        state.time + 1,
        state.valve,
        state.elephantValve,
        state.rate + graph[state.valve].rate + graph[state.elephantValve].rate,
        state.pressure + state.rate,
        [...state.openValves, state.valve],
        [...state.elephantOpenValves, state.elephantValve],
      ));
    }

    if (!state.openValves.includes(state.valve) && !state.elephantOpenValves.includes(state.valve) && graph[state.valve].rate > 0) {
      for (const elephantDestination of graph[state.elephantValve].destinations) {
        queue.push(new State(
          state.time + 1,
          state.valve,
          elephantDestination,
          state.rate + graph[state.valve].rate,
          state.pressure + state.rate,
          [...state.openValves, state.valve],
          state.elephantOpenValves,
        ));
      }
    }

    if (!state.openValves.includes(state.elephantValve) && !state.elephantOpenValves.includes(state.elephantValve) && graph[state.elephantValve].rate > 0) {
      for (const destination of graph[state.valve].destinations) {
        queue.push(new State(
          state.time + 1,
          destination,
          state.elephantValve,
          state.rate + graph[state.elephantValve].rate,
          state.pressure + state.rate,
          state.openValves,
          [...state.elephantOpenValves, state.elephantValve],
        ));
      }
    }

    for (const destination of graph[state.valve].destinations) {
      for (const elephantDestination of graph[state.elephantValve].destinations) {
        queue.push(new State(
          state.time + 1,
          destination,
          elephantDestination,
          state.rate,
          state.pressure + state.rate,
          state.openValves,
          state.elephantOpenValves,
        ));
      }
    }
  }

  return maxPressure;
}
