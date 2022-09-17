use std::collections::BTreeMap;
use std::fs::File;
use std::io::{BufReader, Lines};

fn parse_containers(lines: Lines<BufReader<File>>) -> Vec<i32> {
  lines
    .map(|line| line.unwrap().parse::<i32>().unwrap())
    .collect()
}

fn count_remaining_combinations(
  containers: &Vec<i32>,
  remaining_storage: i32,
  container_index: usize,
) -> i32 {
  if remaining_storage == 0 {
    return 1;
  } else if remaining_storage < 0 {
    return 0;
  }
  (container_index..containers.len())
    .map(|i| count_remaining_combinations(containers, remaining_storage - containers[i], i + 1))
    .sum()
}

pub fn count_storage_combinations(lines: Lines<BufReader<File>>, storage: i32) -> i32 {
  let containers: Vec<i32> = parse_containers(lines);
  count_remaining_combinations(&containers, storage, 0)
}

fn find_remaining_combinations(
  containers: &Vec<i32>,
  remaining_storage: i32,
  container_index: usize,
  container_number: i32,
  combinations: &mut BTreeMap<i32, i32>,
) {
  if remaining_storage == 0 {
    combinations.insert(
      container_number,
      combinations.get(&container_number).unwrap_or(&0) + 1,
    );
    return;
  } else if remaining_storage < 0 {
    return;
  }
  for i in container_index..containers.len() {
    find_remaining_combinations(
      containers,
      remaining_storage - containers[i],
      i + 1,
      container_number + 1,
      combinations,
    );
  }
}

pub fn find_min_container_combination(lines: Lines<BufReader<File>>, storage: i32) -> i32 {
  let containers: Vec<i32> = parse_containers(lines);
  let mut combinations: BTreeMap<i32, i32> = BTreeMap::new();
  find_remaining_combinations(&containers, storage, 0, 0, &mut combinations);
  *combinations.iter().next().unwrap().1
}

#[cfg(test)]
mod tests {
  use crate::day17::{count_storage_combinations, find_min_container_combination};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_storage_combinations() {
    assert_eq!(
      4,
      count_storage_combinations(read_lines("./res/day17/input-test.txt").unwrap(), 25)
    );
    assert_eq!(
      1304,
      count_storage_combinations(read_lines("./res/day17/input.txt").unwrap(), 150)
    );
  }

  #[test]
  fn test_find_min_container_combination() {
    assert_eq!(
      3,
      find_min_container_combination(read_lines("./res/day17/input-test.txt").unwrap(), 25)
    );
    assert_eq!(
      18,
      find_min_container_combination(read_lines("./res/day17/input.txt").unwrap(), 150)
    );
  }
}
