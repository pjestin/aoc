use regex::Regex;
use std::fs::File;
use std::io::{BufReader, Lines};

fn count_possible_from_sides(triangles: Vec<Vec<usize>>) -> usize {
  triangles
    .iter()
    .filter(|sides| {
      assert_eq!(sides.len(), 3, "Wrong number of sides");
      sides[0] + sides[1] > sides[2]
        && sides[0] + sides[2] > sides[1]
        && sides[1] + sides[2] > sides[0]
    })
    .count()
}

pub fn count_possible_triangles(lines: Lines<BufReader<File>>) -> usize {
  let re = Regex::new(r"\d+").unwrap();
  let triangles = lines
    .map(|line| {
      let unrapped_line = line.unwrap();
      re.find_iter(&unrapped_line)
        .map(|side| side.as_str().parse::<usize>().unwrap())
        .collect::<Vec<usize>>()
    })
    .collect();
  count_possible_from_sides(triangles)
}

fn get_vertical_triangles(lines: Lines<BufReader<File>>) -> Vec<Vec<usize>> {
  let mut triangles: Vec<Vec<usize>> = Vec::new();
  let re = Regex::new(r"\d+").unwrap();
  let mut i = 0;
  let mut n_triangles = 0;
  for line in lines {
    let unrapped_line = line.unwrap();
    if i % 3 == 0 {
      for _ in 0..3 {
        triangles.push(Vec::new());
      }
      n_triangles += 3;
    }
    let mut j = 0;
    for side in re.find_iter(&unrapped_line) {
      let side_int = side.as_str().parse::<usize>().unwrap();
      triangles[n_triangles - j - 1].push(side_int);
      j += 1;
    }
    i += 1;
  }
  triangles
}

pub fn count_possible_triangles_vertically(lines: Lines<BufReader<File>>) -> usize {
  let triangles: Vec<Vec<usize>> = get_vertical_triangles(lines);
  count_possible_from_sides(triangles)
}

#[cfg(test)]
mod tests {
  use crate::day03::{count_possible_triangles, count_possible_triangles_vertically};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_possible_triangles() {
    assert_eq!(
      869,
      count_possible_triangles(read_lines("./res/day03/input.txt").unwrap())
    );
  }

  #[test]
  fn test_count_possible_triangles_vertically() {
    assert_eq!(
      1544,
      count_possible_triangles_vertically(read_lines("./res/day03/input.txt").unwrap())
    );
  }
}
