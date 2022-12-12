use crate::assembunny::Assembunny;
use std::fs::File;
use std::io::{BufReader, Lines};

const VERIFICATION_MAX: i64 = 10;

fn verify_with_input(assembunny: &mut Assembunny, input: i64) -> bool {
  assembunny.registers.insert("a".to_owned(), input);

  for signal_index in 0..VERIFICATION_MAX {
    let output: Option<i64> = assembunny.run();
    if output.is_none() || output.unwrap() % 2 != signal_index % 2 {
      return false;
    }
  }

  return true;
}

pub fn find_clock_signal_input(lines: Lines<BufReader<File>>) -> i64 {
  let mut assembunny: Assembunny = Assembunny::from_lines(lines);
  let mut input: i64 = 0;

  loop {
    if verify_with_input(&mut assembunny, input) {
      return input;
    }
    assembunny.reset();
    input += 1;
  }
}

#[cfg(test)]
mod tests {
  use crate::day25::find_clock_signal_input;
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_clock_signal_input() {
    assert_eq!(
      175,
      find_clock_signal_input(read_lines("./res/day25/input.txt").unwrap())
    );
  }
}
