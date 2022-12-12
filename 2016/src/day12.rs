use crate::assembunny::Assembunny;
use std::fs::File;
use std::io::{BufReader, Lines};

pub fn run_program(lines: Lines<BufReader<File>>) -> i64 {
  let mut assembunny: Assembunny = Assembunny::from_lines(lines);
  assembunny.run();
  assembunny.registers["a"]
}

pub fn run_program_with_tweak(lines: Lines<BufReader<File>>) -> i64 {
  let mut assembunny: Assembunny = Assembunny::from_lines(lines);
  assembunny.registers.insert("c".to_owned(), 1);
  assembunny.run();
  assembunny.registers["a"]
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
