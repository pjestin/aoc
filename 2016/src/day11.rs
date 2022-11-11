use regex::Regex;
use std::collections::hash_map::DefaultHasher;
use std::collections::{HashMap, HashSet, VecDeque};
use std::fs::File;
use std::hash::{Hash, Hasher};
use std::io::{BufReader, Lines};

const MICROCHIP_PATTERN: &str = r"a (\w+)-compatible microchip";
const GENERATOR_PATTERN: &str = r"a (\w+) generator";
const FINAL_FLOOR_NUMBER: usize = 4;

#[derive(Eq, PartialEq, Clone, Debug)]
struct State {
  elevator: usize,
  microchips: HashMap<String, usize>,
  generators: HashMap<String, usize>,
  steps: usize,
}

impl Hash for State {
  fn hash<H: Hasher>(&self, state: &mut H) {
    self.elevator.hash(state);
    for element in self.microchips.keys() {
      let element_string: String =
        format!("{}:{};", self.microchips[element], self.generators[element]);
      element_string.hash(state);
    }
  }
}

impl State {
  pub fn is_valid(&self) -> bool {
    for (microchip_element, microchip_floor_number) in &self.microchips {
      let mut connected: bool = false;
      let mut potentially_fried: bool = false;
      for (generator_element, generator_floor_number) in &self.generators {
        if generator_floor_number == microchip_floor_number {
          if generator_element == microchip_element {
            connected = true;
            break;
          } else {
            potentially_fried = true;
          }
        }
      }
      if !connected && potentially_fried {
        return false;
      }
    }
    true
  }

  pub fn away_score(&self) -> usize {
    let mut away_score = FINAL_FLOOR_NUMBER - self.elevator;
    for &microchip_floor_number in self.microchips.values() {
      away_score += FINAL_FLOOR_NUMBER - microchip_floor_number;
    }
    for &generator_floor_number in self.generators.values() {
      away_score += FINAL_FLOOR_NUMBER - generator_floor_number;
    }
    away_score
  }

  pub fn is_final(&self) -> bool {
    self.away_score() == 0
  }

  pub fn minimum_floor(&self) -> usize {
    let mut min: usize = FINAL_FLOOR_NUMBER;
    for &floor_number in self.microchips.values() {
      if floor_number < min {
        min = floor_number;
      }
    }
    for &floor_number in self.generators.values() {
      if floor_number < min {
        min = floor_number;
      }
    }
    min
  }
}

fn parse_state(lines: Lines<BufReader<File>>) -> State {
  let microchip_regex = Regex::new(MICROCHIP_PATTERN).unwrap();
  let generator_regex = Regex::new(GENERATOR_PATTERN).unwrap();
  let mut state = State {
    elevator: 1,
    microchips: HashMap::new(),
    generators: HashMap::new(),
    steps: 0,
  };
  let mut floor_number: usize = 1;

  for line in lines {
    let unwrapped_line = line.unwrap();
    for capture in microchip_regex.captures_iter(&unwrapped_line) {
      let element_name: String = capture[1].to_owned();
      state.microchips.insert(element_name, floor_number);
    }

    for capture in generator_regex.captures_iter(&unwrapped_line) {
      let element_name: String = capture[1].to_owned();
      state.generators.insert(element_name, floor_number);
    }

    floor_number += 1;
  }

  state
}

fn pick_objects_to_move_set(
  moveable_microchips: &Vec<String>,
  moveable_generators: &Vec<String>,
) -> Vec<(Vec<String>, Vec<String>)> {
  let mut objects_to_move_set: Vec<(Vec<String>, Vec<String>)> = Vec::new();

  for microchip_index in 0..moveable_microchips.len() {
    let moveable_microchip = moveable_microchips[microchip_index].clone();
    objects_to_move_set.push((vec![moveable_microchip.clone()], vec![]));

    for second_microchip_index in (microchip_index + 1)..moveable_microchips.len() {
      let second_moveable_microchip = moveable_microchips[second_microchip_index].clone();
      objects_to_move_set.push((
        vec![moveable_microchip.clone(), second_moveable_microchip],
        vec![],
      ));
    }

    for generator_index in 0..moveable_generators.len() {
      let moveable_generator = moveable_generators[generator_index].clone();
      objects_to_move_set.push((vec![moveable_microchip.clone()], vec![moveable_generator]));
    }
  }

  for generator_index in 0..moveable_generators.len() {
    let moveable_generator = moveable_generators[generator_index].clone();
    objects_to_move_set.push((vec![], vec![moveable_generator.clone()]));

    for second_generator_index in (generator_index + 1)..moveable_generators.len() {
      let second_moveable_generator = moveable_generators[second_generator_index].clone();
      objects_to_move_set.push((
        vec![],
        vec![moveable_generator.clone(), second_moveable_generator],
      ));
    }
  }

  objects_to_move_set
}

fn move_floor(state: &State, target_floor: usize) -> Vec<State> {
  let mut moved_states: Vec<State> = Vec::new();

  let mut moveable_microchips: Vec<String> = Vec::new();
  let mut moveable_generators: Vec<String> = Vec::new();
  for (microchip_element, microchip_floor_number) in state.microchips.clone() {
    if microchip_floor_number == state.elevator {
      moveable_microchips.push(microchip_element);
    }
  }
  for (generator_element, generator_floor_number) in state.generators.clone() {
    if generator_floor_number == state.elevator {
      moveable_generators.push(generator_element);
    }
  }

  let objects_to_move_set = pick_objects_to_move_set(&moveable_microchips, &moveable_generators);

  for object_to_move in objects_to_move_set {
    let mut moved_microchips = state.microchips.clone();
    let mut moved_generators = state.generators.clone();
    for microchip in object_to_move.0 {
      moved_microchips.insert(microchip, target_floor);
    }
    for generator in object_to_move.1 {
      moved_generators.insert(generator, target_floor);
    }
    let moved_state = State {
      elevator: target_floor,
      microchips: moved_microchips,
      generators: moved_generators,
      steps: state.steps + 1,
    };
    if moved_state.is_valid() {
      moved_states.push(moved_state);
    }
  }

  moved_states
}

fn arrange(start_state: &State) -> usize {
  let mut queue: VecDeque<State> = VecDeque::new();
  queue.push_back(start_state.clone());
  let mut visited_states: HashSet<u64> = HashSet::new();

  while !queue.is_empty() {
    let state: State = queue.pop_front().unwrap();

    let mut s = DefaultHasher::new();
    state.hash(&mut s);
    let h = s.finish();

    if visited_states.contains(&h) {
      continue;
    } else if state.is_final() {
      return state.steps;
    }
    visited_states.insert(h);

    if state.elevator > 1 && state.elevator > state.minimum_floor() {
      for moved_state in move_floor(&state, state.elevator - 1) {
        queue.push_back(moved_state);
      }
    }
    if state.elevator < FINAL_FLOOR_NUMBER {
      for moved_state in move_floor(&state, state.elevator + 1) {
        queue.push_back(moved_state);
      }
    }
  }

  panic!("Could no find path");
}

pub fn arrange_microchips_and_generators(lines: Lines<BufReader<File>>) -> usize {
  let start_state: State = parse_state(lines);
  arrange(&start_state)
}

pub fn arrange_with_additional_objects(lines: Lines<BufReader<File>>) -> usize {
  let mut start_state: State = parse_state(lines);
  start_state.microchips.insert("elerium".to_owned(), 1);
  start_state.microchips.insert("dilithium".to_owned(), 1);
  start_state.generators.insert("elerium".to_owned(), 1);
  start_state.generators.insert("dilithium".to_owned(), 1);
  arrange(&start_state)
}

#[cfg(test)]
mod tests {
  use crate::day11::{arrange_microchips_and_generators, arrange_with_additional_objects};
  use crate::file_utils::read_lines;

  #[test]
  fn test_arrange_microchips_and_generators() {
    assert_eq!(
      11,
      arrange_microchips_and_generators(read_lines("./res/day11/input-test.txt").unwrap())
    );
    assert_eq!(
      33,
      arrange_microchips_and_generators(read_lines("./res/day11/input.txt").unwrap())
    );
  }

  #[test]
  fn test_arrange_with_additional_objects() {
    assert_eq!(
      57,
      arrange_with_additional_objects(read_lines("./res/day11/input.txt").unwrap())
    );
  }
}
