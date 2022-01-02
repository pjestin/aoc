use crate::vector::Vector;
use std::collections::HashSet;
use std::panic;

fn update_position(position: &mut Vector, c: char) {
  match c {
    '>' => {
      position.add(&Vector { x: 1, y: 0 });
    }
    '^' => {
      position.add(&Vector { x: 0, y: 1 });
    }
    '<' => {
      position.add(&Vector { x: -1, y: 0 });
    }
    'v' => {
      position.add(&Vector { x: 0, y: -1 });
    }
    _ => {
      panic!("Unknown character: {}", c);
    }
  }
}

pub fn count_present_houses(line: &str) -> i32 {
  let mut position = Vector { x: 0, y: 0 };
  let mut presents = HashSet::new();
  presents.insert(position);
  for c in line.chars() {
    update_position(&mut position, c);
    presents.insert(position);
  }
  return presents.len() as i32;
}

pub fn count_present_houses_with_robo(line: &str) -> i32 {
  let mut santa_position = Vector { x: 0, y: 0 };
  let mut robo_santa_position = Vector { x: 0, y: 0 };
  let mut presents = HashSet::new();
  presents.insert(santa_position);
  for (i, c) in line.chars().enumerate() {
    let position = if i % 2 == 0 {
      &mut santa_position
    } else {
      &mut robo_santa_position
    };
    update_position(position, c);
    presents.insert(*position);
  }
  return presents.len() as i32;
}

#[cfg(test)]
mod tests {
  use crate::day03::{count_present_houses, count_present_houses_with_robo};
  use crate::file_utils::read_first_line;

  #[test]
  fn test_count_present_houses() {
    assert_eq!(
      4,
      count_present_houses(&read_first_line("./res/day03/input-test.txt").unwrap())
    );
    assert_eq!(
      2572,
      count_present_houses(&read_first_line("./res/day03/input.txt").unwrap())
    );
  }

  #[test]
  fn test_count_present_houses_with_robo() {
    assert_eq!(
      3,
      count_present_houses_with_robo(&read_first_line("./res/day03/input-test.txt").unwrap())
    );
    assert_eq!(
      2631,
      count_present_houses_with_robo(&read_first_line("./res/day03/input.txt").unwrap())
    );
  }
}
