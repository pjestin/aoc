// use crate::vector::Vector;
use regex::{Captures, Regex};
use std::fs::File;
use std::io::{BufReader, Lines};

struct Node {
  // position: Vector,
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
        // position: Vector {
        //   x: captures[1].parse::<i64>().unwrap(),
        //   y: captures[2].parse::<i64>().unwrap(),
        // },
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

#[cfg(test)]
mod tests {
  use crate::day22::count_viable_pairs;
  use crate::file_utils::read_lines;

  #[test]
  fn test_scramble_password() {
    assert_eq!(
      934,
      count_viable_pairs(read_lines("./res/day22/input.txt").unwrap())
    );
  }
}
