use regex::Regex;
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

const PATTERN_SUE: &str = r"Sue (\d+)";
const PATTERN_GROUP: &str = r"(\w+): (\d+)";

fn parse_sues(lines: Lines<BufReader<File>>) -> HashMap<i32, HashMap<String, i32>> {
  let re_group = Regex::new(PATTERN_GROUP).unwrap();
  let re_sue = Regex::new(PATTERN_SUE).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re_sue.captures(unwrapped_line.as_str()).unwrap();
      let sue_id = cap[1].parse::<i32>().unwrap();
      let groups: HashMap<String, i32> = re_group
        .captures_iter(unwrapped_line.as_str())
        .map(|mat| (mat[1].to_owned(), mat[2].parse::<i32>().unwrap()))
        .collect();
      (sue_id, groups)
    })
    .collect()
}

fn parse_wrapping(lines: Lines<BufReader<File>>) -> HashMap<String, i32> {
  let re = Regex::new(PATTERN_GROUP).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      (cap[1].to_owned(), cap[2].parse::<i32>().unwrap())
    })
    .collect()
}

fn match_sue(sue: &HashMap<String, i32>, wrapping: &HashMap<String, i32>) -> bool {
  wrapping
    .iter()
    .find(|&(wrapping_detection, &quantity)| {
      sue.contains_key(wrapping_detection) && sue[wrapping_detection] != quantity
    })
    .is_none()
}

pub fn find_correct_sue(
  lines: Lines<BufReader<File>>,
  input_wrapping: Lines<BufReader<File>>,
) -> i32 {
  let sues: HashMap<i32, HashMap<String, i32>> = parse_sues(lines);
  let wrapping: HashMap<String, i32> = parse_wrapping(input_wrapping);
  *sues
    .iter()
    .find(|(_, sue)| match_sue(&sue, &wrapping))
    .unwrap()
    .0
}

#[cfg(test)]
mod tests {
  use crate::day16::find_correct_sue;
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_best_cookie() {
    assert_eq!(
      373,
      find_correct_sue(
        read_lines("./res/day16/input.txt").unwrap(),
        read_lines("./res/day16/input-wrapping.txt").unwrap()
      )
    );
  }
}
