use crate::vector::Vector;
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};

fn parse_lights(lines: Lines<BufReader<File>>) -> (HashSet<Vector>, Vector, Vector) {
  let mut lights = HashSet::new();
  let mut max = Vector { x: 0, y: 0 };
  for (x, line) in lines.enumerate() {
    max.x = x as i32;
    let unwrapped_line: String = line.unwrap();
    for (y, c) in unwrapped_line.chars().enumerate() {
      max.y = y as i32;
      if c == '#' {
        lights.insert(Vector {
          x: x as i32,
          y: y as i32,
        });
      }
    }
  }
  (lights, Vector { x: 0, y: 0 }, max)
}

const NEIGHBORS: [Vector; 8] = [
  Vector { x: -1, y: -1 },
  Vector { x: -1, y: 0 },
  Vector { x: -1, y: 1 },
  Vector { x: 0, y: -1 },
  Vector { x: 0, y: 1 },
  Vector { x: 1, y: -1 },
  Vector { x: 1, y: 0 },
  Vector { x: 1, y: 1 },
];

fn iterate(lights: &mut HashSet<Vector>, min: &Vector, max: &Vector, stuck_corners: bool) {
  let old_lights: HashSet<Vector> = lights.clone();
  for x in min.x..(max.x + 1) {
    for y in min.y..(max.y + 1) {
      let position = Vector { x: x, y: y };
      if stuck_corners && (x == min.x || x == max.x) && (y == min.y || y == max.y) {
        lights.insert(position);
        continue;
      }
      let neighbor_count = NEIGHBORS
        .iter()
        .filter(|neighbor| {
          let mut neighbor_position = position.clone();
          neighbor_position.add(&neighbor);
          old_lights.contains(&neighbor_position)
        })
        .count();
      if (old_lights.contains(&position) && (neighbor_count == 2 || neighbor_count == 3))
        || (!old_lights.contains(&position) && neighbor_count == 3)
      {
        lights.insert(position);
      } else {
        lights.remove(&position);
      }
    }
  }
}

pub fn count_lights_after_steps(
  lines: Lines<BufReader<File>>,
  steps: i32,
  stuck_corners: bool,
) -> usize {
  let (mut lights, min, max) = parse_lights(lines);
  for _ in 0..steps {
    iterate(&mut lights, &min, &max, stuck_corners);
  }
  lights.len() as usize
}

#[cfg(test)]
mod tests {
  use crate::day18::count_lights_after_steps;
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_lights_after_steps() {
    assert_eq!(
      4,
      count_lights_after_steps(read_lines("./res/day18/input-test.txt").unwrap(), 4, false)
    );
    assert_eq!(
      1061,
      count_lights_after_steps(read_lines("./res/day18/input.txt").unwrap(), 100, false)
    );
  }

  #[test]
  fn test_count_lights_after_steps_stuck_corners() {
    assert_eq!(
      17,
      count_lights_after_steps(read_lines("./res/day18/input-test-2.txt").unwrap(), 5, true)
    );
    assert_eq!(
      1006,
      count_lights_after_steps(read_lines("./res/day18/input.txt").unwrap(), 100, true)
    );
  }
}
