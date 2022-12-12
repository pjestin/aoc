use crate::assembunny::Assembunny;
use std::fs::File;
use std::io::{BufReader, Lines};

pub fn run_program(lines: Lines<BufReader<File>>) -> i64 {
  let mut assembunny: Assembunny = Assembunny::from_lines(lines);
  assembunny.registers.insert("a".to_owned(), 7);
  assembunny.run();
  assembunny.registers["a"]
}

#[cfg(test)]
mod tests {
  use crate::day23::run_program;
  use crate::file_utils::read_lines;

  #[test]
  fn test_run_program() {
    assert_eq!(
      3,
      run_program(read_lines("./res/day23/input-test.txt").unwrap())
    );
    assert_eq!(
      10440,
      run_program(read_lines("./res/day23/input.txt").unwrap())
    );
  }
}
