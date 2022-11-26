use crate::vector::Vector;
use std::collections::{HashSet, VecDeque};

const RELATIVE_NEIGHBORS: [Vector; 4] = [
  Vector { x: 1, y: 0 },
  Vector { x: -1, y: 0 },
  Vector { x: 0, y: 1 },
  Vector { x: 0, y: -1 },
];

const CLOSE_LOCATION_MAX_STEPS: usize = 50;

#[derive(Debug)]
struct State {
  position: Vector,
  steps: usize,
}

fn is_open(position: &Vector, favorite: i32) -> bool {
  if position.x < 0 || position.y < 0 {
    return false;
  }

  let mut sum: i32 = position.x * position.x
    + 3 * position.x
    + 2 * position.x * position.y
    + position.y
    + position.y * position.y
    + favorite;

  let mut n_bits = 0;
  while sum > 0 {
    sum = sum & (sum - 1);
    n_bits += 1;
  }
  n_bits & 1 == 0
}

fn visit_neighbors(queue: &mut VecDeque<State>, state: &State, favorite: i32) {
  for relative_neighbor in RELATIVE_NEIGHBORS {
    let new_position = Vector {
      x: state.position.x + relative_neighbor.x,
      y: state.position.y + relative_neighbor.y,
    };
    if is_open(&new_position, favorite) {
      queue.push_back(State {
        position: new_position,
        steps: state.steps + 1,
      })
    }
  }
}

pub fn find_shortest_path(target_position: Vector, favorite: i32) -> usize {
  let mut queue: VecDeque<State> = VecDeque::new();
  queue.push_back(State {
    position: Vector { x: 1, y: 1 },
    steps: 0,
  });

  let mut visited: HashSet<Vector> = HashSet::new();

  while !queue.is_empty() {
    let state: State = queue.pop_front().unwrap();

    if state.position == target_position {
      return state.steps;
    } else if visited.contains(&state.position) {
      continue;
    }

    visited.insert(state.position);

    visit_neighbors(&mut queue, &state, favorite);
  }

  panic!("Target position not found");
}

pub fn count_close_locations(favorite: i32) -> usize {
  let mut queue: VecDeque<State> = VecDeque::new();
  queue.push_back(State {
    position: Vector { x: 1, y: 1 },
    steps: 0,
  });

  let mut visited: HashSet<Vector> = HashSet::new();

  while !queue.is_empty() {
    let state: State = queue.pop_front().unwrap();

    if state.steps > CLOSE_LOCATION_MAX_STEPS || visited.contains(&state.position) {
      continue;
    }

    visited.insert(state.position);

    visit_neighbors(&mut queue, &state, favorite);
  }

  visited.len()
}

#[cfg(test)]
mod tests {
  use crate::day13::{count_close_locations, find_shortest_path};
  use crate::vector::Vector;

  #[test]
  fn test_find_shortest_path() {
    assert_eq!(11, find_shortest_path(Vector { x: 7, y: 4 }, 10));
    assert_eq!(96, find_shortest_path(Vector { x: 31, y: 39 }, 1358));
  }

  #[test]
  fn test_count_close_locations() {
    assert_eq!(151, count_close_locations(10));
    assert_eq!(141, count_close_locations(1358));
  }
}
