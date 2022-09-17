use crate::vector::Vector;
use std::collections::HashSet;

fn parse_instructions(line: &str) -> Vec<&str> {
  line.split(", ").collect::<Vec<&str>>()
}

pub fn get_distance(line: &str) -> i32 {
  let instructions: Vec<&str> = parse_instructions(line);
  let mut position = Vector { x: 0, y: 0 };
  let mut direction = Vector { x: 0, y: 1 };

  for instruction in instructions {
    if instruction.chars().nth(0).unwrap() == 'R' {
      direction = Vector {
        x: direction.y,
        y: -direction.x,
      };
    } else {
      direction = Vector {
        x: -direction.y,
        y: direction.x,
      };
    }

    let distance: i32 = instruction[1..].parse::<i32>().unwrap();
    position.x += distance * direction.x;
    position.y += distance * direction.y;
  }

  position.x.abs() + position.y.abs()
}

pub fn get_distance_to_visited(line: &str) -> i32 {
  let instructions: Vec<&str> = parse_instructions(line);
  let mut position = Vector { x: 0, y: 0 };
  let mut direction = Vector { x: 0, y: 1 };
  let mut visited: HashSet<Vector> = HashSet::new();
  visited.insert(Vector { x: 0, y: 0 });

  for instruction in instructions {
    if instruction.chars().nth(0).unwrap() == 'R' {
      direction = Vector {
        x: direction.y,
        y: -direction.x,
      };
    } else {
      direction = Vector {
        x: -direction.y,
        y: direction.x,
      };
    }

    let distance: i32 = instruction[1..].parse::<i32>().unwrap();
    for _ in 0..distance {
      position.add(&direction);
      if visited.contains(&position) {
        return position.x.abs() + position.y.abs();
      }
      visited.insert(position.clone());
    }
  }

  panic!("No position found");
}

#[cfg(test)]
mod tests {
  use crate::day01::{get_distance, get_distance_to_visited};
  use crate::file_utils::read_first_line;

  #[test]
  fn test_get_distance() {
    assert_eq!(
      8,
      get_distance(&read_first_line("./res/day01/input-test.txt").unwrap())
    );
    assert_eq!(
      287,
      get_distance(&read_first_line("./res/day01/input.txt").unwrap())
    );
  }

  #[test]
  fn test_get_distance_to_visited() {
    assert_eq!(
      133,
      get_distance_to_visited(&read_first_line("./res/day01/input.txt").unwrap())
    );
  }
}
