use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(Clone, Debug)]
enum Instruction {
  Cpy { input: String, target: String },
  Inc(String),
  Dec(String),
  Jnz { check: String, offset: i64 },
}

impl Instruction {
  pub fn from_string(s: &String) -> Instruction {
    let split_string: Vec<&str> = s.split_whitespace().collect();
    match split_string[0] {
      "cpy" => Instruction::Cpy {
        input: split_string[1].to_owned(),
        target: split_string[2].to_owned(),
      },
      "inc" => Instruction::Inc(split_string[1].to_owned()),
      "dec" => Instruction::Dec(split_string[1].to_owned()),
      "jnz" => Instruction::Jnz {
        check: split_string[1].to_owned(),
        offset: split_string[2].parse::<i64>().unwrap(),
      },
      _ => panic!("Unrecognized op"),
    }
  }

  pub fn run(&self, registers: &mut HashMap<String, i64>, index: &mut usize) {
    match self {
      Instruction::Cpy { input, target } => {
        let parsed_input = input.parse::<i64>();
        let value = match parsed_input {
          Ok(input_value) => input_value,
          Err(_) => registers[input],
        };
        registers.insert(target.clone(), value);
        *index += 1;
      }
      Instruction::Inc(target) => {
        registers.insert(target.clone(), registers[target] + 1);
        *index += 1;
      }
      Instruction::Dec(target) => {
        registers.insert(target.clone(), registers[target] - 1);
        *index += 1;
      }
      Instruction::Jnz { check, offset } => {
        let parsed_check = check.parse::<i64>();
        let check_value = match parsed_check {
          Ok(v) => v,
          Err(_) => registers[check],
        };
        if check_value != 0 {
          *index = (*index as i64 + offset) as usize;
        } else {
          *index += 1;
        }
      }
    };
  }
}

fn parse_program(lines: Lines<BufReader<File>>) -> Vec<Instruction> {
  lines
    .map(|line| {
      let unwrapped_line: String = line.unwrap();
      Instruction::from_string(&unwrapped_line)
    })
    .collect()
}

pub fn run_program(lines: Lines<BufReader<File>>) -> i64 {
  let program: Vec<Instruction> = parse_program(lines);
  let mut registers: HashMap<String, i64> = HashMap::from([
    ("a".to_owned(), 0),
    ("b".to_owned(), 0),
    ("c".to_owned(), 0),
    ("d".to_owned(), 0),
  ]);
  let mut index = 0;

  while index < program.len() {
    let instruction = &program[index];
    instruction.run(&mut registers, &mut index)
  }

  registers[&"a".to_owned()]
}

pub fn run_program_with_tweak(lines: Lines<BufReader<File>>) -> i64 {
  let program: Vec<Instruction> = parse_program(lines);
  let mut registers: HashMap<String, i64> = HashMap::from([
    ("a".to_owned(), 0),
    ("b".to_owned(), 0),
    ("c".to_owned(), 1),
    ("d".to_owned(), 0),
  ]);
  let mut index = 0;

  while index < program.len() {
    let instruction = &program[index];
    instruction.run(&mut registers, &mut index)
  }

  registers[&"a".to_owned()]
}

#[cfg(test)]
mod tests {
  use crate::day12::{run_program, run_program_with_tweak};
  use crate::file_utils::read_lines;

  #[test]
  fn test_run_program() {
    assert_eq!(
      42,
      run_program(read_lines("./res/day12/input-test.txt").unwrap())
    );
    assert_eq!(
      318020,
      run_program(read_lines("./res/day12/input.txt").unwrap())
    );
  }

  #[test]
  fn test_run_program_with_tweak() {
    assert_eq!(
      42,
      run_program_with_tweak(read_lines("./res/day12/input-test.txt").unwrap())
    );
    assert_eq!(
      9227674,
      run_program_with_tweak(read_lines("./res/day12/input.txt").unwrap())
    );
  }
}
