use crate::vector::Vector;
use regex::{Captures, Regex};
use std::fs::File;
use std::io::{BufReader, Lines};

struct Node {
  position: Vector,
  // size: i64,
  used: i64,
  avail: i64,
  // used_pct: i64,
}

const DISK_USAGE_PATTERN: &str =
  r"/dev/grid/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%";

fn parse_nodes(lines: Lines<BufReader<File>>) -> Vec<Node> {
  let mut nodes: Vec<Node> = Vec::new();
  let re = Regex::new(DISK_USAGE_PATTERN).unwrap();

  for line in lines {
    let unwrapped_line: String = line.unwrap();
    if re.is_match(&unwrapped_line) {
      let captures: Captures = re.captures(&unwrapped_line).unwrap();
      nodes.push(Node {
        position: Vector {
          x: captures[1].parse::<i64>().unwrap(),
          y: captures[2].parse::<i64>().unwrap(),
        },
        // size: captures[3].parse::<i64>().unwrap(),
        used: captures[4].parse::<i64>().unwrap(),
        avail: captures[5].parse::<i64>().unwrap(),
        // used_pct: captures[6].parse::<i64>().unwrap(),
      });
    }
  }

  nodes
}

pub fn count_viable_pairs(lines: Lines<BufReader<File>>) -> usize {
  let nodes: Vec<Node> = parse_nodes(lines);
  let mut used: Vec<i64> = nodes.iter().map(|node| node.used).collect();
  let mut avail: Vec<i64> = nodes.iter().map(|node| node.avail).collect();
  used.sort_by(|a, b| b.cmp(a));
  avail.sort_by(|a, b| b.cmp(a));

  let mut used_index: usize = 0;
  let mut avail_index: usize = 0;
  let mut viable_pair_count: usize = 0;
  let mut accumulated_count: usize = 0;

  while used_index < used.len() && avail_index < avail.len() {
    if used[used_index] <= avail[avail_index] {
      accumulated_count += 1;
      avail_index += 1;
    } else {
      viable_pair_count += accumulated_count;
      used_index += 1;
    }
  }

  viable_pair_count
}

fn display_nodes(nodes: &Vec<Node>) -> String {
  let max_x: usize = nodes
    .iter()
    .map(|node| node.position.x as usize)
    .max()
    .unwrap();
  let max_y: usize = nodes
    .iter()
    .map(|node| node.position.y as usize)
    .max()
    .unwrap();

  let mut node_strings: Vec<Vec<String>> = vec![vec![String::new(); max_x + 1]; max_y + 1];
  // println!("node_strings: {:?}", node_strings);

  for node in nodes {
    let row: usize = node.position.y as usize;
    let col: usize = node.position.x as usize;

    if node.position.x == 0 && node.position.y == 0 {
      node_strings[row][col] = "(.)".to_owned();
    } else if node.position.x as usize == max_x && node.position.y == 0 {
      node_strings[row][col] = " G ".to_owned();
    } else if node.used == 0 {
      node_strings[row][col] = " _ ".to_owned();
    } else if node.used > 100 {
      node_strings[row][col] = " # ".to_owned();
    } else {
      node_strings[row][col] = " . ".to_owned();
    }
  }

  node_strings
    .iter()
    .map(|row| row.join(""))
    .collect::<Vec<String>>()
    .join("\n")
}

pub fn count_steps_to_goal_data(lines: Lines<BufReader<File>>) -> usize {
  let nodes: Vec<Node> = parse_nodes(lines);
  println!("{}", display_nodes(&nodes));
  0
}

#[cfg(test)]
mod tests {
  use crate::day22::{count_steps_to_goal_data, count_viable_pairs};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_viable_pairs() {
    assert_eq!(
      934,
      count_viable_pairs(read_lines("./res/day22/input.txt").unwrap())
    );
  }

  #[test]
  fn test_count_steps_to_goal_data() {
    assert_eq!(
      7,
      count_steps_to_goal_data(read_lines("./res/day22/input-test.txt").unwrap())
    );
    assert_eq!(
      207,
      count_steps_to_goal_data(read_lines("./res/day22/input.txt").unwrap())
    );
  }
}
