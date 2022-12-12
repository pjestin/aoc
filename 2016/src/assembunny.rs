use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(Clone, Debug)]
pub enum Instruction {
  Cpy { input: String, target: String },
  Inc(String),
  Dec(String),
  Jnz { check: String, offset: String },
  Tgl(String),
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
        offset: split_string[2].to_owned(),
      },
      "tgl" => Instruction::Tgl(split_string[1].to_owned()),
      _ => panic!("Unrecognized op"),
    }
  }
}

pub struct Assembunny {
  pub instructions: Vec<Instruction>,
  pub registers: HashMap<String, i64>,
  pub index: usize,
}

impl Assembunny {
  pub fn from_lines(lines: Lines<BufReader<File>>) -> Assembunny {
    let instructions: Vec<Instruction> = lines
      .map(|line| {
        let unwrapped_line: String = line.unwrap();
        Instruction::from_string(&unwrapped_line)
      })
      .collect();

    Assembunny {
      instructions,
      registers: HashMap::from([
        ("a".to_owned(), 0),
        ("b".to_owned(), 0),
        ("c".to_owned(), 0),
        ("d".to_owned(), 0),
      ]),
      index: 0,
    }
  }

  pub fn run(&mut self) {
    while self.index < self.instructions.len() {
      self.index += 1;
      match &self.instructions[self.index - 1] {
        Instruction::Cpy { input, target } => {
          if !self.registers.contains_key(target) {
            continue;
          }
          let parsed_input = input.parse::<i64>();
          let value = match parsed_input {
            Ok(input_value) => input_value,
            Err(_) => {
              if self.registers.contains_key(input) {
                self.registers[input]
              } else {
                continue;
              }
            }
          };
          self.registers.insert(target.clone(), value);
        }
        Instruction::Inc(target) => {
          if !self.registers.contains_key(target) {
            continue;
          }
          self
            .registers
            .insert(target.clone(), self.registers[target] + 1);
        }
        Instruction::Dec(target) => {
          if !self.registers.contains_key(target) {
            continue;
          }
          self
            .registers
            .insert(target.clone(), self.registers[target] - 1);
        }
        Instruction::Jnz { check, offset } => {
          let parsed_check = check.parse::<i64>();
          let parsed_offset = offset.parse::<i64>();
          let check_value = match parsed_check {
            Ok(v) => v,
            Err(_) => {
              if self.registers.contains_key(check) {
                self.registers[check]
              } else {
                continue;
              }
            }
          };
          let offset_value = match parsed_offset {
            Ok(v) => v,
            Err(_) => {
              if self.registers.contains_key(offset) {
                self.registers[offset]
              } else {
                continue;
              }
            }
          };
          if check_value != 0 {
            self.index = (self.index as i64 + offset_value - 1) as usize;
          }
        }
        Instruction::Tgl(target_register) => {
          if !self.registers.contains_key(target_register) {
            continue;
          }
          let target_index: i64 = self.index as i64 + self.registers[target_register] - 1;
          if target_index < 0 || target_index >= self.instructions.len() as i64 {
            continue;
          }
          let target_instruction: &Instruction = &self.instructions[target_index as usize];
          self.instructions[target_index as usize] = match target_instruction {
            Instruction::Cpy { input, target } => Instruction::Jnz {
              check: input.clone(),
              offset: target.clone(),
            },
            Instruction::Inc(target) => Instruction::Dec(target.clone()),
            Instruction::Dec(target) => Instruction::Inc(target.clone()),
            Instruction::Jnz { check, offset } => Instruction::Cpy {
              input: check.clone(),
              target: offset.clone(),
            },
            Instruction::Tgl(target) => Instruction::Inc(target.clone()),
          };
        }
      };
    }
  }
}
