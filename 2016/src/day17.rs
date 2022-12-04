use crate::vector::Vector;
use md5;
use std::collections::{HashSet, VecDeque};

const TARGET_POSITION: Vector = Vector { x: 3, y: 3 };

fn get_position(path: &String) -> Vector {
  let mut position = Vector { x: 0, y: 0 };
  for c in path.chars() {
    match c {
      'U' => position.y -= 1,
      'D' => position.y += 1,
      'L' => position.x -= 1,
      'R' => position.x += 1,
      _ => panic!("Unknown path character: {}", c),
    }
  }
  position
}

fn is_position_valid(position: &Vector) -> bool {
  position.x >= 0
    && position.x <= TARGET_POSITION.x
    && position.y >= 0
    && position.y <= TARGET_POSITION.y
}

fn visit_neighbors(path: &String, passcode: &str, queue: &mut VecDeque<String>) {
  let digest: md5::Digest = md5::compute(format!("{}{}", passcode, path));
  if digest[0] >> 4 >= 11 {
    queue.push_back(format!("{}U", path));
  }
  if digest[0] & 15 >= 11 {
    queue.push_back(format!("{}D", path));
  }
  if digest[1] >> 4 >= 11 {
    queue.push_back(format!("{}L", path));
  }
  if digest[1] & 15 >= 11 {
    queue.push_back(format!("{}R", path));
  }
}

pub fn find_shortest_path(passcode: &str) -> String {
  let mut visited_paths: HashSet<String> = HashSet::new();
  let mut queue: VecDeque<String> = VecDeque::new();
  queue.push_back("".to_owned());

  while !queue.is_empty() {
    let path: String = queue.pop_front().unwrap();
    if visited_paths.contains(&path) {
      continue;
    }
    visited_paths.insert(path.clone());

    let position: Vector = get_position(&path);
    if position == TARGET_POSITION {
      return path;
    } else if !is_position_valid(&position) {
      continue;
    }

    visit_neighbors(&path, passcode, &mut queue)
  }

  panic!("No path found");
}

pub fn find_longest_path_length(passcode: &str) -> usize {
  let mut visited_paths: HashSet<String> = HashSet::new();
  let mut queue: VecDeque<String> = VecDeque::new();
  queue.push_back("".to_owned());
  let mut path_lengths: HashSet<usize> = HashSet::new();

  while !queue.is_empty() {
    let path: String = queue.pop_front().unwrap();
    if visited_paths.contains(&path) {
      continue;
    }
    visited_paths.insert(path.clone());

    let position: Vector = get_position(&path);
    if position == TARGET_POSITION {
      path_lengths.insert(path.len());
      continue;
    } else if !is_position_valid(&position) {
      continue;
    }

    visit_neighbors(&path, passcode, &mut queue)
  }

  *path_lengths.iter().max().unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day17::{find_longest_path_length, find_shortest_path};

  #[test]
  fn test_find_shortest_path() {
    assert_eq!("DDRRRD", find_shortest_path("ihgpwlah"));
    assert_eq!("DDUDRLRRUDRD", find_shortest_path("kglvqrro"));
    assert_eq!(
      "DRURDRUDDLLDLUURRDULRLDUUDDDRR",
      find_shortest_path("ulqzkmiv")
    );
    assert_eq!("RDRDUDLRDR", find_shortest_path("dmypynyp"));
  }

  #[test]
  fn test_find_longest_path_length() {
    assert_eq!(370, find_longest_path_length("ihgpwlah"));
    assert_eq!(492, find_longest_path_length("kglvqrro"));
    assert_eq!(830, find_longest_path_length("ulqzkmiv"));
    assert_eq!(386, find_longest_path_length("dmypynyp"));
  }
}
