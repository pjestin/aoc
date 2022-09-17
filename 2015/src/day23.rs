use regex::Regex;
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(Debug)]
struct Instruction {
  tp: String,
  args: Vec<String>,
}

impl Instruction {
  pub fn run(&self, registers: &mut HashMap<String, i32>, index: &mut i32) {
    match self.tp.as_str() {
      "hlf" => *registers.get_mut(&self.args[0]).unwrap() /= 2,
      "tpl" => *registers.get_mut(&self.args[0]).unwrap() *= 3,
      "inc" => *registers.get_mut(&self.args[0]).unwrap() += 1,
      "jmp" => *index += self.args[0].parse::<i32>().unwrap() - 1,
      "jie" => {
        if registers[&self.args[0]] % 2 == 0 {
          *index += self.args[1].parse::<i32>().unwrap() - 1
        }
      }
      "jio" => {
        if registers[&self.args[0]] == 1 {
          *index += self.args[1].parse::<i32>().unwrap() - 1
        }
      }
      _ => (),
    }
  }
}

const PATTERN: &str = r"(\w+) \+?([\w\d-]+)(?:, \+?([\w\d+-]+))?";

fn parse_instructions(lines: Lines<BufReader<File>>) -> Vec<Instruction> {
  let re = Regex::new(PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      let tp = cap[1].to_owned();
      let mut args: Vec<String> = vec![cap[2].to_owned()];
      if cap.get(3).is_some() {
        args.push(cap[3].to_owned());
      }
      Instruction { tp: tp, args: args }
    })
    .collect()
}

pub fn run_program(lines: Lines<BufReader<File>>, start_a: i32) -> i32 {
  let instructions = parse_instructions(lines);
  let mut registers: HashMap<String, i32> =
    HashMap::from([("a".to_owned(), start_a), ("b".to_owned(), 0)]);
  let mut index: i32 = 0;
  while (index as usize) < instructions.len() {
    instructions[index as usize].run(&mut registers, &mut index);
    index += 1;
  }
  registers[&"b".to_owned()]
}

#[cfg(test)]
mod tests {
  use crate::day23::run_program;
  use crate::file_utils::read_lines;

  #[test]
  fn test_run_program() {
    assert_eq!(
      0,
      run_program(read_lines("./res/day23/input-test.txt").unwrap(), 0)
    );
    assert_eq!(
      307,
      run_program(read_lines("./res/day23/input.txt").unwrap(), 0)
    );
    assert_eq!(
      0,
      run_program(read_lines("./res/day23/input-test.txt").unwrap(), 1)
    );
    assert_eq!(
      160,
      run_program(read_lines("./res/day23/input.txt").unwrap(), 1)
    );
  }
}
