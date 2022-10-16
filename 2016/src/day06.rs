use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

fn decrypt_message(lines: Lines<BufReader<File>>, cmp: fn(a: usize, b: usize) -> bool) -> String {
  let lines_vec: Vec<Vec<char>> = lines.map(|line| line.unwrap().chars().collect()).collect();
  (0..lines_vec[0].len())
    .map(|index| {
      let mut letter_count: HashMap<char, usize> = HashMap::new();
      for line in &lines_vec {
        let c: char = line[index];
        if !letter_count.contains_key(&c) {
          letter_count.insert(c, 0);
        }
        letter_count.insert(c, letter_count[&c] + 1);
      }
      let mut best_match: char = '\0';
      let mut best_match_count: usize = 0;
      for (letter, count) in letter_count {
        if best_match == '\0' || cmp(count, best_match_count) {
          best_match_count = count;
          best_match = letter;
        }
      }
      best_match
    })
    .collect()
}

pub fn decrypt_message_most_common(lines: Lines<BufReader<File>>) -> String {
  decrypt_message(lines, |a, b| a > b)
}

pub fn decrypt_message_least_common(lines: Lines<BufReader<File>>) -> String {
  decrypt_message(lines, |a, b| a < b)
}

#[cfg(test)]
mod tests {
  use crate::day06::{decrypt_message_least_common, decrypt_message_most_common};
  use crate::file_utils::read_lines;

  #[test]
  fn test_decrypt_message_most_common() {
    assert_eq!(
      "easter",
      decrypt_message_most_common(read_lines("./res/day06/input-test.txt").unwrap())
    );
    assert_eq!(
      "wkbvmikb",
      decrypt_message_most_common(read_lines("./res/day06/input.txt").unwrap())
    );
  }

  #[test]
  fn test_decrypt_message_least_common() {
    assert_eq!(
      "advent",
      decrypt_message_least_common(read_lines("./res/day06/input-test.txt").unwrap())
    );
    assert_eq!(
      "evakwaga",
      decrypt_message_least_common(read_lines("./res/day06/input.txt").unwrap())
    );
  }
}
