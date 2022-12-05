use std::fs::File;
use std::io::{BufReader, Lines};

struct Rule {
  start: u64,
  end: u64,
}

fn parse_rules(lines: Lines<BufReader<File>>) -> Vec<Rule> {
  lines.map(|line| {
    let unwrapped_line: String = line.unwrap();
    let split_line: Vec<&str> = unwrapped_line.split("-").collect();
    return Rule {
      start: split_line[0].parse::<u64>().unwrap(),
      end: split_line[1].parse::<u64>().unwrap(),
    };
  }).collect()
}

pub fn find_first_allowed_ip(lines: Lines<BufReader<File>>, max_ip: u64) -> u64 {
  let rules: Vec<Rule> = parse_rules(lines);

  let mut ip: u64 = 0;
  while ip <= max_ip {
    let mut denied: bool = false;
    for rule in &rules {
      if ip >= rule.start && ip <= rule.end {
        ip = rule.end + 1;
        denied = true;
      }
    }
    if !denied {
      return ip;
    }
  }

  panic!("no allowed IP found");
}

pub fn count_allowed_ips(lines: Lines<BufReader<File>>, max_ip: u64) -> usize {
  let rules: Vec<Rule> = parse_rules(lines);

  let mut count: usize = 0;
  let mut ip: u64 = 0;
  while ip <= max_ip {
    let mut denied: bool = false;
    for rule in &rules {
      if ip >= rule.start && ip <= rule.end {
        ip = rule.end + 1;
        denied = true;
      }
    }
    if !denied {
      count += 1;
      ip += 1;
    }
  }

  count
}

#[cfg(test)]
mod tests {
  use crate::day20::{find_first_allowed_ip, count_allowed_ips};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_first_allowed_ip() {
    assert_eq!(
      3,
      find_first_allowed_ip(read_lines("./res/day20/input-test.txt").unwrap(), 9)
    );
    assert_eq!(
      23923783,
      find_first_allowed_ip(read_lines("./res/day20/input.txt").unwrap(), u32::MAX.into())
    );
  }

  #[test]
  fn test_count_allowed_ips() {
    assert_eq!(
      2,
      count_allowed_ips(read_lines("./res/day20/input-test.txt").unwrap(), 9)
    );
    assert_eq!(
      125,
      count_allowed_ips(read_lines("./res/day20/input.txt").unwrap(), u32::MAX.into())
    );
  }
}
