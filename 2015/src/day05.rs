use std::fs::File;
use std::io::{BufReader, Lines};

const VOWELS: [char; 5] = ['a', 'e', 'i', 'o', 'u'];
const UGLY_PATTERNS: [&str; 4] = ["ab", "cd", "pq", "xy"];

fn count_vowels(characters: &Vec<char>) -> i32 {
  characters.iter().filter(|c| VOWELS.contains(&c)).count() as i32
}

fn has_repeating_letter(characters: &Vec<char>) -> bool {
  for i in 0..(characters.len() - 1) {
    if characters[i] == characters[i + 1] {
      return true;
    }
  }
  return false;
}

fn has_ugly_pattern(characters: &Vec<char>) -> bool {
  for i in 0..(characters.len() - 1) {
    let sub_string = format!("{}{}", characters[i], characters[i + 1]);
    if UGLY_PATTERNS.contains(&sub_string.as_str()) {
      return true;
    }
  }
  return false;
}

fn is_word_nice(word: &String) -> bool {
  let characters: Vec<char> = word.chars().collect();
  count_vowels(&characters) >= 3
    && has_repeating_letter(&characters)
    && !has_ugly_pattern(&characters)
}

pub fn count_nice_words(lines: Lines<BufReader<File>>) -> i32 {
  lines.filter(|w| is_word_nice(w.as_ref().unwrap())).count() as i32
}

fn has_repeating_pair(characters: &Vec<char>) -> bool {
  for i in 0..(characters.len() - 1) {
    for j in (i + 2)..(characters.len() - 1) {
      if characters[i] == characters[j] && characters[i + 1] == characters[j + 1] {
        return true;
      }
    }
  }
  return false;
}

fn has_repeating_letter_with_intermediate(characters: &Vec<char>) -> bool {
  for i in 0..(characters.len() - 2) {
    if characters[i] == characters[i + 2] {
      return true;
    }
  }
  return false;
}

fn is_word_nicer(word: &String) -> bool {
  let characters: Vec<char> = word.chars().collect();
  has_repeating_pair(&characters) && has_repeating_letter_with_intermediate(&characters)
}

pub fn count_nicer_words(lines: Lines<BufReader<File>>) -> i32 {
  lines.filter(|w| is_word_nicer(w.as_ref().unwrap())).count() as i32
}

#[cfg(test)]
mod tests {
  use crate::day05::{count_nice_words, count_nicer_words};
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

  #[test]
  fn test_count_nicer_words() {
    assert_eq!(
      2,
      count_nicer_words(read_lines("./res/day05/input-test-2.txt").unwrap())
    );
    assert_eq!(
      55,
      count_nicer_words(read_lines("./res/day05/input.txt").unwrap())
    );
  }
}
