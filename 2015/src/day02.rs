use std::cmp::min;
use std::fs::File;
use std::io::{BufReader, Lines};

fn parse_presents(lines: Lines<BufReader<File>>) -> Vec<Vec<i32>> {
  lines
    .map(|line| {
      line
        .unwrap()
        .split("x")
        .map(|s| s.parse::<i32>().unwrap())
        .collect()
    })
    .collect()
}

pub fn find_wrapping_paper_surface(lines: Lines<BufReader<File>>) -> i32 {
  let presents = parse_presents(lines);
  let mut area = 0;
  for present in presents {
    let mut min_side_area = i32::MAX;
    for (i, s) in present.iter().enumerate() {
      let side_area = s * present[(i + 1) % present.len()];
      min_side_area = min(min_side_area, side_area);
      area += 2 * side_area;
    }
    area += min_side_area;
  }
  return area;
}

pub fn find_ribbon_length(lines: Lines<BufReader<File>>) -> i32 {
  let presents = parse_presents(lines);
  let mut ribbon_length = 0;
  for present in presents {
    let mut min_perimeter = i32::MAX;
    let mut volume = 1;
    for (i, s) in present.iter().enumerate() {
      let perimeter = 2 * (s + present[(i + 1) % present.len()]);
      min_perimeter = min(min_perimeter, perimeter);
      volume *= s;
    }
    ribbon_length += min_perimeter + volume;
  }
  return ribbon_length;
}

#[cfg(test)]
mod tests {
  use crate::day02::{find_ribbon_length, find_wrapping_paper_surface};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_wrapping_paper_surface() {
    assert_eq!(
      101,
      find_wrapping_paper_surface(read_lines("./res/day02/input-test.txt").unwrap())
    );
    assert_eq!(
      1586300,
      find_wrapping_paper_surface(read_lines("./res/day02/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_ribbon_length() {
    assert_eq!(
      48,
      find_ribbon_length(read_lines("./res/day02/input-test.txt").unwrap())
    );
    assert_eq!(
      3737498,
      find_ribbon_length(read_lines("./res/day02/input.txt").unwrap())
    );
  }
}
