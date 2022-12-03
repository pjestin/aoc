use regex::{Captures, Regex};
use std::fs::File;
use std::io::{BufReader, Lines};

const DISK_PATTERN: &str = r"Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+).";

#[derive(Debug)]
struct Disk {
  offset: i64,
  size: i64,
}

fn parse_disks(lines: Lines<BufReader<File>>) -> Vec<Disk> {
  let re = Regex::new(DISK_PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line: String = line.unwrap();
      let captures: Captures = re.captures(&unwrapped_line).unwrap();

      return Disk {
        offset: captures[1].parse::<i64>().unwrap() + captures[3].parse::<i64>().unwrap(),
        size: captures[2].parse::<i64>().unwrap(),
      };
    })
    .collect()
}

fn find_button_time_from_disks(disks: &Vec<Disk>) -> i64 {
  let mut factor: i64 = 1;
  let mut time: i64 = 0;

  for disk in disks {
    while (time + disk.offset) % disk.size != 0 {
      time += factor;
    }
    factor *= disk.size;
  }

  time
}

pub fn find_button_time(lines: Lines<BufReader<File>>) -> i64 {
  let disks: Vec<Disk> = parse_disks(lines);
  find_button_time_from_disks(&disks)
}

pub fn find_button_time_additional_disk(lines: Lines<BufReader<File>>) -> i64 {
  let mut disks: Vec<Disk> = parse_disks(lines);
  disks.push(Disk {
    offset: (disks.len() + 1) as i64,
    size: 11,
  });

  find_button_time_from_disks(&disks)
}

#[cfg(test)]
mod tests {
  use crate::day15::{find_button_time, find_button_time_additional_disk};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_button_time() {
    assert_eq!(
      5,
      find_button_time(read_lines("./res/day15/input-test.txt").unwrap())
    );
    assert_eq!(
      16824,
      find_button_time(read_lines("./res/day15/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_button_time_additional_disk() {
    assert_eq!(
      85,
      find_button_time_additional_disk(read_lines("./res/day15/input-test.txt").unwrap())
    );
    assert_eq!(
      3543984,
      find_button_time_additional_disk(read_lines("./res/day15/input.txt").unwrap())
    );
  }
}
