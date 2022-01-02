use std::fs::File;
use std::io::{BufReader, Lines};

const VOWELS: [char; 5] = ['a', 'e', 'i', 'o', 'u'];
const UGLY_PATTERNS: [&str; 4] = ["ab", "cd", "pq", "xy"];

fn count_vowels(word: &String) -> i32 {
  word.chars().filter(|c| VOWELS.contains(&c)).count() as i32
}

fn has_repeating_letter(word: &String) -> bool {
  let characters: Vec<char> = word.chars().collect();
  for i in 1..(characters.len()) {
    if characters[i] == characters[i - 1] {
      return true;
    }
  }
  return false;
}

fn has_ugly_pattern(word: &String) -> bool {
  let characters: Vec<char> = word.chars().collect();
  for i in 1..(characters.len()) {
    let sub_string = format!("{}{}", characters[i - 1], characters[i]);
    if UGLY_PATTERNS.contains(&sub_string.as_str()) {
      return true;
    }
  }
  return false;
}

fn is_word_nice(word: &String) -> bool {
  return count_vowels(&word) >= 3 && has_repeating_letter(&word) && !has_ugly_pattern(&word);
}

pub fn count_nice_words(lines: Lines<BufReader<File>>) -> i32 {
  lines.filter(|w| is_word_nice(w.as_ref().unwrap())).count() as i32
}

#[cfg(test)]
mod tests {
  use crate::day05::count_nice_words;
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_nice_words() {
    assert_eq!(
      2,
      count_nice_words(read_lines("./res/day05/input-test.txt").unwrap())
    );
    assert_eq!(
      255,
      count_nice_words(read_lines("./res/day05/input.txt").unwrap())
    );
  }
}
