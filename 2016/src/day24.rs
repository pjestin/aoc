use crate::vector::Vector;
use std::cmp::max;
use std::collections::{HashMap, HashSet, VecDeque};
use std::fs::File;
use std::io::{BufReader, Lines};

const RELATIVE_NEIGHBORS: [Vector; 4] = [
  Vector { x: 1, y: 0 },
  Vector { x: -1, y: 0 },
  Vector { x: 0, y: 1 },
  Vector { x: 0, y: -1 },
];

#[derive(Debug)]
struct Layout {
  height: usize,
  width: usize,
  walls: HashSet<Vector>,
  checkpoints: HashMap<Vector, u32>,
  start: Vector,
}

#[derive(Debug)]
struct State {
  position: Vector,
  visited_checkpoints: HashSet<u32>,
  steps: usize,
}

impl State {
  fn hash(&self) -> String {
    let mut checkpoints: Vec<String> = self
      .visited_checkpoints
      .iter()
      .map(|&cp| cp.to_string())
      .collect();
    checkpoints.sort();
    format!("{};{}", self.position, checkpoints.join(";"))
  }
}

fn parse_layout(lines: Lines<BufReader<File>>) -> Layout {
  let mut row: usize = 0;
  let mut col: usize = 0;
  let mut walls: HashSet<Vector> = HashSet::new();
  let mut checkpoints: HashMap<Vector, u32> = HashMap::new();
  let mut start: Vector = Vector { x: 0, y: 0 };

  let mut height: usize = 0;
  let mut width: usize = 0;

  for line in lines {
    height = max(height, row + 1);
    for c in line.unwrap().chars() {
      width = max(width, col + 1);
      let position = Vector {
        x: col as i64,
        y: row as i64,
      };

      if c == '#' {
        walls.insert(position);
      } else if c == '.' {
        col += 1;
        continue;
      } else if c == '0' {
        start = position;
      } else {
        let checkpoint_number: u32 = c.to_digit(10).unwrap();
        checkpoints.insert(position, checkpoint_number);
      }
      col += 1;
    }
    row += 1;
    col = 0;
  }

  Layout {
    height,
    width,
    walls,
    checkpoints,
    start,
  }
}

fn find_shortest_path(layout: &Layout, return_trip: bool) -> usize {
  let mut visited_states: HashSet<String> = HashSet::new();
  let mut queue: VecDeque<State> = VecDeque::new();
  queue.push_back(State {
    position: layout.start,
    visited_checkpoints: HashSet::new(),
    steps: 0,
  });

  while !queue.is_empty() {
    let mut state: State = queue.pop_front().unwrap();
    let state_hash: String = state.hash();

    if layout.checkpoints.contains_key(&state.position) {
      state
        .visited_checkpoints
        .insert(layout.checkpoints[&state.position]);
    }

    if state.visited_checkpoints.len() == layout.checkpoints.len()
      && (!return_trip || state.position == layout.start)
    {
      return state.steps;
    } else if visited_states.contains(&state_hash) {
      continue;
    }

    visited_states.insert(state_hash);

    for relative_neighbor in RELATIVE_NEIGHBORS {
      let neighbor: Vector = Vector {
        x: state.position.x + relative_neighbor.x,
        y: state.position.y + relative_neighbor.y,
      };

      if neighbor.x >= 0
        && neighbor.x < layout.width as i64
        && neighbor.y >= 0
        && neighbor.y < layout.height as i64
        && !layout.walls.contains(&neighbor)
      {
        queue.push_back(State {
          position: neighbor,
          visited_checkpoints: state.visited_checkpoints.iter().map(|&cp| cp).collect(),
          steps: state.steps + 1,
        });
      }
    }
  }

  panic!("No path found");
}

pub fn count_fewest_steps(lines: Lines<BufReader<File>>, return_trip: bool) -> usize {
  let layout: Layout = parse_layout(lines);
  find_shortest_path(&layout, return_trip)
}

#[cfg(test)]
mod tests {
  use crate::day24::count_fewest_steps;
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_fewest_steps() {
    assert_eq!(
      14,
      count_fewest_steps(read_lines("./res/day24/input-test.txt").unwrap(), false)
    );
    assert_eq!(
      464,
      count_fewest_steps(read_lines("./res/day24/input.txt").unwrap(), false)
    );
  }

  #[test]
  fn test_count_fewest_steps_return() {
    assert_eq!(
      20,
      count_fewest_steps(read_lines("./res/day24/input-test.txt").unwrap(), true)
    );
    assert_eq!(
      652,
      count_fewest_steps(read_lines("./res/day24/input.txt").unwrap(), true)
    );
  }
}
