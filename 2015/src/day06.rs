use crate::vector::Vector;
use regex::Regex;
use std::cmp::max;
use std::fs::File;
use std::io::{BufReader, Lines};

struct Instruction {
  pub nature: String,
  pub origin: Vector,
  pub end: Vector,
}

const PATTERN: &str = r"([\w ]+) (\d+),(\d+) through (\d+),(\d+)";

fn parse_instructions(lines: Lines<BufReader<File>>) -> Vec<Instruction> {
  let re = Regex::new(PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      let origin = Vector {
        x: cap[2].parse::<i32>().unwrap(),
        y: cap[3].parse::<i32>().unwrap(),
      };
      let end = Vector {
        x: cap[4].parse::<i32>().unwrap() + 1,
        y: cap[5].parse::<i32>().unwrap() + 1,
      };
      Instruction {
        nature: cap[1].to_owned(),
        origin: origin,
        end: end,
      }
    })
    .collect()
}

fn update_light_brightness_discrete(lights: &mut Vec<Vec<i32>>, x: usize, y: usize, nature: &str) {
  match nature {
    "turn on" => lights[y as usize][x as usize] = 1,
    "turn off" => lights[y as usize][x as usize] = 0,
    "toggle" => lights[y as usize][x as usize] = 1 - lights[y as usize][x as usize],
    _ => panic!("Unknown nature: {}", nature),
  }
}

fn update_light_brightness(lights: &mut Vec<Vec<i32>>, x: usize, y: usize, nature: &str) {
  match nature {
    "turn on" => lights[y as usize][x as usize] += 1,
    "turn off" => lights[y as usize][x as usize] = max(0, lights[y as usize][x as usize] - 1),
    "toggle" => lights[y as usize][x as usize] += 2,
    _ => panic!("Unknown nature: {}", nature),
  }
}

fn find_total_brightness_with_update_fn(
  lines: Lines<BufReader<File>>,
  update_fn: fn(&mut std::vec::Vec<std::vec::Vec<i32>>, usize, usize, &str),
) -> i32 {
  let instructions: Vec<Instruction> = parse_instructions(lines);
  let mut lights: Vec<Vec<i32>> = vec![vec![0; 1000]; 1000];

  instructions.iter().for_each(|instruction| {
    for x in instruction.origin.x..instruction.end.x {
      for y in instruction.origin.y..instruction.end.y {
        update_fn(
          &mut lights,
          x as usize,
          y as usize,
          instruction.nature.as_str(),
        );
      }
    }
  });

  lights
    .iter()
    .map(|light_row| light_row.iter().sum::<i32>())
    .sum()
}

pub fn count_lit_lights(lines: Lines<BufReader<File>>) -> i32 {
  find_total_brightness_with_update_fn(lines, update_light_brightness_discrete)
}

pub fn find_total_brightness(lines: Lines<BufReader<File>>) -> i32 {
  find_total_brightness_with_update_fn(lines, update_light_brightness)
}

#[cfg(test)]
mod tests {
  use crate::day06::{count_lit_lights, find_total_brightness};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_lit_lights() {
    assert_eq!(
      998996,
      count_lit_lights(read_lines("./res/day06/input-test.txt").unwrap())
    );
    assert_eq!(
      400410,
      count_lit_lights(read_lines("./res/day06/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_total_brightness() {
    assert_eq!(
      1001996,
      find_total_brightness(read_lines("./res/day06/input-test.txt").unwrap())
    );
    assert_eq!(
      15343601,
      find_total_brightness(read_lines("./res/day06/input.txt").unwrap())
    );
  }
}
