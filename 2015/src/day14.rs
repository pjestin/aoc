use regex::Regex;
use std::fs::File;
use std::io::{BufReader, Lines};

const PATTERN: &str =
  r"(\w+) can fly (\d+) km/s for (\d+) seconds, but then must rest for (\d+) seconds.";

struct Reindeer {
  speed: i32,
  fly_time: i32,
  rest_time: i32,
  score: i32,
  remaining_fly_time: i32,
  remaining_rest_time: i32,
  distance: i32,
}

impl Reindeer {
  fn advance(&mut self) {
    if self.remaining_fly_time > 0 {
      self.distance += self.speed;
      self.remaining_fly_time -= 1;
      if self.remaining_fly_time == 0 {
        self.remaining_rest_time = self.rest_time;
      }
    } else {
      self.remaining_rest_time -= 1;
      if self.remaining_rest_time == 0 {
        self.remaining_fly_time = self.fly_time;
      }
    }
  }
}

fn parse_reindeers(lines: Lines<BufReader<File>>) -> Vec<Reindeer> {
  let re = Regex::new(PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      Reindeer {
        speed: cap[2].parse::<i32>().unwrap(),
        fly_time: cap[3].parse::<i32>().unwrap(),
        rest_time: cap[4].parse::<i32>().unwrap(),
        score: 0,
        remaining_fly_time: cap[3].parse::<i32>().unwrap(),
        remaining_rest_time: 0,
        distance: 0,
      }
    })
    .collect()
}

pub fn find_winning_reindeer_distance(lines: Lines<BufReader<File>>, finish_time: i32) -> i32 {
  let mut reindeers: Vec<Reindeer> = parse_reindeers(lines);
  reindeers
    .iter_mut()
    .map(|reindeer| {
      for _ in 0..finish_time {
        reindeer.advance();
      }
      reindeer.distance
    })
    .max()
    .unwrap()
}

pub fn find_winning_reindeer_score(lines: Lines<BufReader<File>>, finish_time: i32) -> i32 {
  let mut reindeers: Vec<Reindeer> = parse_reindeers(lines);
  for _ in 0..finish_time {
    let mut leading_reindeer_distance = 0;
    reindeers.iter_mut().for_each(|reindeer| {
      reindeer.advance();
      if reindeer.distance >= leading_reindeer_distance {
        leading_reindeer_distance = reindeer.distance;
      }
    });
    for reindeer in reindeers.iter_mut() {
      if reindeer.distance == leading_reindeer_distance {
        reindeer.score += 1;
      }
    }
  }
  reindeers
    .iter()
    .map(|reindeer| reindeer.score)
    .max()
    .unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day14::{find_winning_reindeer_distance, find_winning_reindeer_score};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_winning_reindeer_distance() {
    assert_eq!(
      1120,
      find_winning_reindeer_distance(read_lines("./res/day14/input-test.txt").unwrap(), 1000)
    );
    assert_eq!(
      2696,
      find_winning_reindeer_distance(read_lines("./res/day14/input.txt").unwrap(), 2503)
    );
  }

  #[test]
  fn test_find_winning_reindeer_score() {
    assert_eq!(
      689,
      find_winning_reindeer_score(read_lines("./res/day14/input-test.txt").unwrap(), 1000)
    );
    assert_eq!(
      1084,
      find_winning_reindeer_score(read_lines("./res/day14/input.txt").unwrap(), 2503)
    );
  }
}
