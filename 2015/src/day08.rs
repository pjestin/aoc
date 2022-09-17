use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};

pub fn count_non_value_characters(lines: Lines<BufReader<File>>) -> i32 {
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let size = unwrapped_line.len();
      let mut index: usize = 1;
      let mut character_count: usize = 0;
      while index < size - 1 {
        match &unwrapped_line[index..index + 2] {
          "\\x" => index += 4,
          "\\\\" => index += 2,
          "\\\"" => index += 2,
          _ => index += 1,
        }
        character_count += 1;
      }
      (size - character_count) as i32
    })
    .sum()
}

pub fn find_encoded_string_growth(lines: Lines<BufReader<File>>) -> i32 {
  let special_characters = HashSet::from(['\\', '\"']);
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      unwrapped_line
        .chars()
        .map(|c| {
          if special_characters.contains(&c) {
            2
          } else {
            1
          }
        })
        .sum::<i32>()
        - unwrapped_line.len() as i32
        + 2
    })
    .sum()
}

#[cfg(test)]
mod tests {
  use crate::day08::{count_non_value_characters, find_encoded_string_growth};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_non_value_characters() {
    assert_eq!(
      12,
      count_non_value_characters(read_lines("./res/day08/input-test.txt").unwrap())
    );
    assert_eq!(
      1371,
      count_non_value_characters(read_lines("./res/day08/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_encoded_string_growth() {
    assert_eq!(
      19,
      find_encoded_string_growth(read_lines("./res/day08/input-test.txt").unwrap())
    );
    assert_eq!(
      2117,
      find_encoded_string_growth(read_lines("./res/day08/input.txt").unwrap())
    );
  }
}
