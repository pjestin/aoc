use regex::Regex;
use std::fs::File;
use std::io::{BufReader, Lines};

const SWAP_POSITIONS_PATTERN: &str = r"swap position (\d+) with position (\d+)";
const SWAP_LETTERS_PATTERN: &str = r"swap letter (\w) with letter (\w)";
const ROTATE_LEFT_PATTERN: &str = r"rotate left (\d+) steps?";
const ROTATE_RIGHT_PATTERN: &str = r"rotate right (\d+) steps?";
const ROTATE_LETTER_PATTERN: &str = r"rotate based on position of letter (\w)";
const REVERSE_PATTERN: &str = r"reverse positions (\d+) through (\d+)";
const MOVE_PATTERN: &str = r"move position (\d+) to position (\d+)";

fn index_of(chars: &Vec<char>, x: char) -> usize {
  chars.iter().position(|r| *r == x).unwrap()
}

#[derive(Clone, Debug)]
enum Instruction {
  SwapPositions { x: usize, y: usize },
  SwapLetters { x: char, y: char },
  RotateLeft(usize),
  RotateRight(usize),
  RotateLetter(char),
  Reverse { x: usize, y: usize },
  Move { x: usize, y: usize },
}

impl Instruction {
  pub fn scramble(&self, password: &mut Vec<char>) {
    match self {
      Instruction::SwapPositions { x, y } => {
        password.swap(*x, *y);
      }
      Instruction::SwapLetters { x, y } => {
        let x_position: usize = index_of(&password, *x);
        let y_position: usize = index_of(&password, *y);
        let tmp: char = password[x_position];
        password[x_position] = password[y_position];
        password[y_position] = tmp;
      }
      Instruction::RotateLeft(x) => {
        password.rotate_left(*x);
      }
      Instruction::RotateRight(x) => {
        password.rotate_right(*x);
      }
      Instruction::RotateLetter(x) => {
        let x_position: usize = index_of(&password, *x);
        password.rotate_right(1);
        password.rotate_right(x_position);
        if x_position >= 4 {
          password.rotate_right(1);
        }
      }
      Instruction::Reverse { x, y } => {
        for i in *x..=((*x + *y) / 2) {
          password.swap(i, *x + *y - i);
        }
      }
      Instruction::Move { x, y } => {
        let moved: char = password.remove(*x);
        password.insert(*y, moved);
      }
    }
  }

  pub fn unscramble(&self, password: &mut Vec<char>) {
    match self {
      Instruction::RotateLeft(x) => {
        password.rotate_right(*x);
      }
      Instruction::RotateRight(x) => {
        password.rotate_left(*x);
      }
      Instruction::RotateLetter(x) => {
        let x_position: usize = index_of(&password, *x);
        let steps: usize = if x_position == 0 {
          1
        } else if x_position % 2 == 0 {
          (x_position + password.len()) / 2 + 1
        } else {
          x_position / 2 + 1
        };
        password.rotate_left(steps);
      }
      Instruction::Move { x, y } => {
        let moved: char = password.remove(*y);
        password.insert(*x, moved);
      }
      _ => self.scramble(password),
    }
  }
}

fn parse_instructions(lines: Lines<BufReader<File>>) -> Vec<Instruction> {
  let swap_positions_re = Regex::new(SWAP_POSITIONS_PATTERN).unwrap();
  let swap_letters_re = Regex::new(SWAP_LETTERS_PATTERN).unwrap();
  let rotate_left_re = Regex::new(ROTATE_LEFT_PATTERN).unwrap();
  let rotate_right_re = Regex::new(ROTATE_RIGHT_PATTERN).unwrap();
  let rotate_letter_re = Regex::new(ROTATE_LETTER_PATTERN).unwrap();
  let reverse_re = Regex::new(REVERSE_PATTERN).unwrap();
  let move_re = Regex::new(MOVE_PATTERN).unwrap();

  lines
    .map(|line| {
      let unwrapped_line: String = line.unwrap();
      if swap_positions_re.is_match(&unwrapped_line) {
        let captures = swap_positions_re.captures(&unwrapped_line).unwrap();
        Instruction::SwapPositions {
          x: captures[1].parse::<usize>().unwrap(),
          y: captures[2].parse::<usize>().unwrap(),
        }
      } else if swap_letters_re.is_match(&unwrapped_line) {
        let captures = swap_letters_re.captures(&unwrapped_line).unwrap();
        Instruction::SwapLetters {
          x: captures[1].chars().next().unwrap(),
          y: captures[2].chars().next().unwrap(),
        }
      } else if rotate_left_re.is_match(&unwrapped_line) {
        let captures = rotate_left_re.captures(&unwrapped_line).unwrap();
        Instruction::RotateLeft(captures[1].parse::<usize>().unwrap())
      } else if rotate_right_re.is_match(&unwrapped_line) {
        let captures = rotate_right_re.captures(&unwrapped_line).unwrap();
        Instruction::RotateRight(captures[1].parse::<usize>().unwrap())
      } else if rotate_letter_re.is_match(&unwrapped_line) {
        let captures = rotate_letter_re.captures(&unwrapped_line).unwrap();
        Instruction::RotateLetter(captures[1].chars().next().unwrap())
      } else if reverse_re.is_match(&unwrapped_line) {
        let captures = reverse_re.captures(&unwrapped_line).unwrap();
        Instruction::Reverse {
          x: captures[1].parse::<usize>().unwrap(),
          y: captures[2].parse::<usize>().unwrap(),
        }
      } else if move_re.is_match(&unwrapped_line) {
        let captures = move_re.captures(&unwrapped_line).unwrap();
        Instruction::Move {
          x: captures[1].parse::<usize>().unwrap(),
          y: captures[2].parse::<usize>().unwrap(),
        }
      } else {
        panic!("Unable to parse line: {}", unwrapped_line);
      }
    })
    .collect()
}

pub fn scramble_password(lines: Lines<BufReader<File>>, start_password: &str) -> String {
  let instructions: Vec<Instruction> = parse_instructions(lines);

  let mut password: Vec<char> = start_password.chars().collect();
  for instruction in instructions {
    instruction.scramble(&mut password);
  }

  password.iter().collect()
}

pub fn unscramble_password(lines: Lines<BufReader<File>>, start_password: &str) -> String {
  let mut instructions: Vec<Instruction> = parse_instructions(lines);
  instructions.reverse();

  let mut password: Vec<char> = start_password.chars().collect();
  for instruction in instructions {
    instruction.unscramble(&mut password);
  }

  password.iter().collect()
}

#[cfg(test)]
mod tests {
  use crate::day21::{scramble_password, unscramble_password};
  use crate::file_utils::read_lines;

  #[test]
  fn test_scramble_password() {
    assert_eq!(
      "decab",
      scramble_password(read_lines("./res/day21/input-test.txt").unwrap(), "abcde")
    );
    assert_eq!(
      "bgfacdeh",
      scramble_password(read_lines("./res/day21/input.txt").unwrap(), "abcdefgh")
    );
  }

  #[test]
  fn test_unscramble_password() {
    assert_eq!(
      "abcde",
      unscramble_password(read_lines("./res/day21/input-test.txt").unwrap(), "decab")
    );
    assert_eq!(
      "abcdefgh",
      unscramble_password(read_lines("./res/day21/input.txt").unwrap(), "bgfacdeh")
    );
    assert_eq!(
      "bdgheacf",
      unscramble_password(read_lines("./res/day21/input.txt").unwrap(), "fbgdceah")
    );
  }
}
