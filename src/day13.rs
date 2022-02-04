use regex::Regex;
use std::collections::HashMap;
use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};
use std::iter::FromIterator;

const PATTERN: &str = r"(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+).";

fn parse_graph(lines: Lines<BufReader<File>>) -> HashMap<(String, String), i32> {
  let re = Regex::new(PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      let attendee_1 = cap[1].to_owned();
      let happiness_change = if &cap[2] == "gain" {
        cap[3].parse::<i32>().unwrap()
      } else {
        -cap[3].parse::<i32>().unwrap()
      };
      let attendee_2 = cap[4].to_owned();
      ((attendee_1, attendee_2), happiness_change)
    })
    .collect()
}

fn build_combinations(attendees: &Vec<String>) -> Vec<Vec<String>> {
  if attendees.is_empty() {
    return vec![vec![]];
  }
  let sub_combinations: Vec<Vec<String>> =
    build_combinations(&attendees[1..attendees.len()].to_vec());
  let mut combinations = vec![];
  for c in sub_combinations {
    let n = c.len();
    for i in 0..n + 1 {
      let mut combination = c.clone();
      combination.insert(i, attendees[0].clone());
      combinations.push(combination);
    }
  }
  combinations
}

fn modulo(x: i32, m: i32) -> i32 {
  return (x % m + m) % m;
}

fn find_happiness_change(combination: &Vec<String>, graph: &HashMap<(String, String), i32>) -> i32 {
  let mut happiness_change = 0;
  for i in 0..combination.len() as i32 {
    let current: String = combination[i as usize].clone();
    let left_index = (modulo(i - 1, combination.len() as i32)) as usize;
    let right_index = (modulo(i + 1, combination.len() as i32)) as usize;
    happiness_change += graph
      .get(&(current.clone(), combination[left_index].clone()))
      .unwrap_or(&0);
    happiness_change += graph
      .get(&(current.clone(), combination[right_index].clone()))
      .unwrap_or(&0);
  }
  happiness_change
}

pub fn find_ideal_arrangement(lines: Lines<BufReader<File>>) -> i32 {
  let graph: HashMap<(String, String), i32> = parse_graph(lines);
  let attendees: Vec<String> = Vec::from_iter(
    graph
      .keys()
      .map(|s| s.1.clone())
      .collect::<HashSet<String>>(),
  );
  let combinations: Vec<Vec<String>> = build_combinations(&attendees);
  combinations
    .iter()
    .map(|combination| find_happiness_change(combination, &graph))
    .max()
    .unwrap()
}

pub fn find_ideal_arrangement_with_myself(lines: Lines<BufReader<File>>) -> i32 {
  let graph: HashMap<(String, String), i32> = parse_graph(lines);
  let mut attendees = Vec::from_iter(
    graph
      .keys()
      .map(|s| s.1.clone())
      .collect::<HashSet<String>>(),
  );
  attendees.push("Me".to_owned());
  let combinations: Vec<Vec<String>> = build_combinations(&attendees);
  combinations
    .iter()
    .map(|combination| find_happiness_change(combination, &graph))
    .max()
    .unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day13::{find_ideal_arrangement, find_ideal_arrangement_with_myself};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_ideal_arrangement() {
    assert_eq!(
      330,
      find_ideal_arrangement(read_lines("./res/day13/input-test.txt").unwrap())
    );
    assert_eq!(
      664,
      find_ideal_arrangement(read_lines("./res/day13/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_ideal_arrangement_with_myself() {
    assert_eq!(
      286,
      find_ideal_arrangement_with_myself(read_lines("./res/day13/input-test.txt").unwrap())
    );
    assert_eq!(
      640,
      find_ideal_arrangement_with_myself(read_lines("./res/day13/input.txt").unwrap())
    );
  }
}
