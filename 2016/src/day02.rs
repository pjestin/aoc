use crate::vector::Vector;
use std::cmp::{max, min};
use std::fs::File;
use std::io::{BufReader, Lines};

fn map_position_to_digit(position: &Vector) -> char {
  match position {
    Vector { x: -1, y: 1 } => '1',
    Vector { x: 0, y: 1 } => '2',
    Vector { x: 1, y: 1 } => '3',
    Vector { x: -1, y: 0 } => '4',
    Vector { x: 0, y: 0 } => '5',
    Vector { x: 1, y: 0 } => '6',
    Vector { x: -1, y: -1 } => '7',
    Vector { x: 0, y: -1 } => '8',
    Vector { x: 1, y: -1 } => '9',
    _ => panic!("Invalid position"),
  }
}

fn get_digit_from_instruction(line: &String, position: &mut Vector) -> char {
  for c in line.chars() {
    match c {
      'U' => position.y = min(1, position.y + 1),
      'R' => position.x = min(1, position.x + 1),
      'D' => position.y = max(-1, position.y - 1),
      'L' => position.x = max(-1, position.x - 1),
      _ => {}
    }
  }

  map_position_to_digit(position)
}

pub fn get_code(lines: Lines<BufReader<File>>) -> String {
  let mut position = Vector { x: 0, y: 0 };
  let mut digits = Vec::<char>::new();
  for line in lines {
    let unwrapped_line = line.unwrap();
    let digit: char = get_digit_from_instruction(&unwrapped_line, &mut position);
    digits.push(digit);
  }
  String::from_iter(digits)
}

fn map_position_to_digit_actual_keypad(position: &Vector) -> char {
  match position {
    Vector { x: 0, y: 2 } => '1',
    Vector { x: -1, y: 1 } => '2',
    Vector { x: 0, y: 1 } => '3',
    Vector { x: 1, y: 1 } => '4',
    Vector { x: -2, y: 0 } => '5',
    Vector { x: -1, y: 0 } => '6',
    Vector { x: 0, y: 0 } => '7',
    Vector { x: 1, y: 0 } => '8',
    Vector { x: 2, y: 0 } => '9',
    Vector { x: -1, y: -1 } => 'A',
    Vector { x: 0, y: -1 } => 'B',
    Vector { x: 1, y: -1 } => 'C',
    Vector { x: 0, y: -2 } => 'D',
    _ => panic!("Invalid position: {}", position),
  }
}

fn get_digit_from_instruction_actual_keypad(line: &String, position: &mut Vector) -> char {
  for c in line.chars() {
    match c {
      'U' => position.y = min(2 - position.x, min(2 + position.x, position.y + 1)),
      'R' => position.x = min(2 - position.y, min(2 + position.y, position.x + 1)),
      'D' => position.y = max(-2 - position.x, max(-2 + position.x, position.y - 1)),
      'L' => position.x = max(-2 - position.y, max(-2 + position.y, position.x - 1)),
      _ => {}
    }
  }

  map_position_to_digit_actual_keypad(position)
}

pub fn get_code_actual_keypad(lines: Lines<BufReader<File>>) -> String {
  let mut position = Vector { x: -2, y: 0 };
  let mut digits = Vec::<char>::new();
  for line in lines {
    let unwrapped_line = line.unwrap();
    let digit: char = get_digit_from_instruction_actual_keypad(&unwrapped_line, &mut position);
    digits.push(digit);
  }
  String::from_iter(digits)
}

#[cfg(test)]
mod tests {
  use crate::day02::{get_code, get_code_actual_keypad};
  use crate::file_utils::read_lines;

  #[test]
  fn test_get_code() {
    assert_eq!(
      "1985",
      get_code(read_lines("./res/day02/input-test.txt").unwrap())
    );
    assert_eq!(
      "97289",
      get_code(read_lines("./res/day02/input.txt").unwrap())
    );
  }

  #[test]
  fn test_get_code_actual_keypad() {
    assert_eq!(
      "5DB3",
      get_code_actual_keypad(read_lines("./res/day02/input-test.txt").unwrap())
    );
    assert_eq!(
      "9A7DC",
      get_code_actual_keypad(read_lines("./res/day02/input.txt").unwrap())
    );
  }
}
