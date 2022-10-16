use regex::Regex;
use std::collections::BTreeMap;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(Debug)]
struct Room {
  pub name: String,
  pub sector_id: u64,
  pub checksum: String,
}

impl Room {
  pub fn is_real(&self) -> bool {
    let mut letter_counts: BTreeMap<char, u64> = BTreeMap::new();
    for letter in self.name.chars() {
      if letter == '-' {
        continue;
      }
      if !letter_counts.contains_key(&letter) {
        letter_counts.insert(letter, 0);
      }
      letter_counts.insert(letter, letter_counts[&letter] + 1);
    }

    let mut checksum_letters: Vec<char> = Vec::new();
    for _ in 0..5 {
      let mut max_count: u64 = 0;
      let mut max_count_letter: char = '\0';
      for (&letter, &count) in &letter_counts {
        if count > max_count {
          max_count = count;
          max_count_letter = letter;
        }
      }
      checksum_letters.push(max_count_letter);
      letter_counts.remove(&max_count_letter);
    }

    let checksum_string: String = checksum_letters.iter().collect();
    checksum_string == self.checksum
  }

  pub fn decrypt_name(&self) -> String {
    self
      .name
      .chars()
      .map(|c| {
        if c == '-' {
          ' '
        } else {
          (((c as u8) - 97 + (self.sector_id % 26) as u8) % 26 + 97) as char
        }
      })
      .collect()
  }
}

const ROOM_PATTERN: &str = r"([a-zA-Z-]+)-(\d+)\[(\w+)\]";
const NORTHPOLE_OBJECT_STORAGE: &str = "northpole object storage";

fn parse_room(room_string: &String) -> Room {
  let re = Regex::new(ROOM_PATTERN).unwrap();
  let captures = re.captures(room_string).unwrap();
  Room {
    name: captures[1].to_owned(),
    sector_id: captures[2].parse::<u64>().unwrap(),
    checksum: captures[3].to_owned(),
  }
}

pub fn sum_real_room_sector_id(lines: Lines<BufReader<File>>) -> u64 {
  lines
    .map(|line| parse_room(&line.unwrap()))
    .filter(|room| room.is_real())
    .map(|room| room.sector_id)
    .sum()
}

pub fn get_storage_room_sector_id(lines: Lines<BufReader<File>>) -> u64 {
  let room: Room = lines
    .map(|line| parse_room(&line.unwrap()))
    .filter(|room| room.is_real() && room.decrypt_name() == NORTHPOLE_OBJECT_STORAGE)
    .next()
    .unwrap();
  room.sector_id
}

#[cfg(test)]
mod tests {
  use crate::day04::{get_storage_room_sector_id, sum_real_room_sector_id};
  use crate::file_utils::read_lines;

  #[test]
  fn test_sum_real_room_sector_id() {
    assert_eq!(
      1514,
      sum_real_room_sector_id(read_lines("./res/day04/input-test.txt").unwrap())
    );
    assert_eq!(
      361724,
      sum_real_room_sector_id(read_lines("./res/day04/input.txt").unwrap())
    );
  }

  #[test]
  fn test_get_storage_room_sector_id() {
    assert_eq!(
      482,
      get_storage_room_sector_id(read_lines("./res/day04/input.txt").unwrap())
    );
  }
}
