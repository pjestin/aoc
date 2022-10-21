use regex::Regex;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(PartialEq, Eq)]
enum Direction {
  Row,
  Column,
}

struct RectInstruction {
  size_row: usize,
  size_column: usize,
}

struct RotateInstruction {
  direction: Direction,
  index: usize,
  shift: usize,
}

struct Instruction {
  rect: Option<RectInstruction>,
  rotate: Option<RotateInstruction>,
}

impl Instruction {
  pub fn apply(&self, grid: &mut Vec<Vec<bool>>) {
    if self.rect.is_some() {
      let rect = self.rect.as_ref().unwrap();
      for row in 0..rect.size_row {
        for column in 0..rect.size_column {
          grid[row][column] = true;
        }
      }
    } else if self.rotate.is_some() {
      let rotate = self.rotate.as_ref().unwrap();
      if rotate.direction == Direction::Row {
        let row: Vec<bool> = grid[rotate.index].iter().map(|&pixel| pixel).collect();
        for column in 0..grid[0].len() {
          let source_index: usize = (column + grid[0].len() - rotate.shift) % grid[0].len();
          grid[rotate.index][column] = row[source_index];
        }
      } else {
        let column: Vec<bool> = grid.iter().map(|row| row[rotate.index]).collect();
        for row in 0..grid.len() {
          let source_index: usize = (row + grid.len() - rotate.shift) % grid.len();
          grid[row][rotate.index] = column[source_index];
        }
      }
    }
  }
}

fn parse_instructions(lines: Lines<BufReader<File>>) -> Vec<Instruction> {
  let rect_regex = Regex::new(r"rect (\d+)x(\d+)").unwrap();
  let rotate_regex = Regex::new(r"rotate (\w+) \w=(\d+) by (\d+)").unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      if rect_regex.is_match(&unwrapped_line) {
        let captures = rect_regex.captures(&unwrapped_line).unwrap();
        Instruction {
          rect: Some(RectInstruction {
            size_row: captures[2].parse::<usize>().unwrap(),
            size_column: captures[1].parse::<usize>().unwrap(),
          }),
          rotate: None,
        }
      } else if rotate_regex.is_match(&unwrapped_line) {
        let captures = rotate_regex.captures(&unwrapped_line).unwrap();

        let direction = if &captures[1] == "row" {
          Direction::Row
        } else if &captures[1] == "column" {
          Direction::Column
        } else {
          panic!("could not parse rotate instruction: {}", unwrapped_line);
        };

        Instruction {
          rect: None,
          rotate: Some(RotateInstruction {
            direction,
            index: captures[2].parse::<usize>().unwrap(),
            shift: captures[3].parse::<usize>().unwrap(),
          }),
        }
      } else {
        panic!("could not parse input line: {}", unwrapped_line);
      }
    })
    .collect()
}

fn grid_to_string(grid: &Vec<Vec<bool>>) -> String {
  grid
    .iter()
    .map(|row| {
      let row_string = row
        .iter()
        .map(|&pixel| if pixel { '#' } else { '.' })
        .collect::<String>();
      format!("{}\n", row_string)
    })
    .collect()
}

pub fn count_on_pixels(
  lines: Lines<BufReader<File>>,
  screen_width: usize,
  screen_height: usize,
) -> usize {
  let instructions = parse_instructions(lines);
  let mut grid: Vec<Vec<bool>> = vec![vec![false; screen_width]; screen_height];
  instructions
    .iter()
    .for_each(|instruction| instruction.apply(&mut grid));
  grid
    .iter()
    .map(|row| row.iter().filter(|&pixel| *pixel).count())
    .sum()
}

pub fn display_pixels(
  lines: Lines<BufReader<File>>,
  screen_width: usize,
  screen_height: usize,
) -> String {
  let instructions = parse_instructions(lines);
  let mut grid: Vec<Vec<bool>> = vec![vec![false; screen_width]; screen_height];
  instructions
    .iter()
    .for_each(|instruction| instruction.apply(&mut grid));
  grid_to_string(&grid)
}

#[cfg(test)]
mod tests {
  use crate::day08::{count_on_pixels, display_pixels};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_on_pixels() {
    assert_eq!(
      6,
      count_on_pixels(read_lines("./res/day08/input-test.txt").unwrap(), 7, 3)
    );
    assert_eq!(
      116,
      count_on_pixels(read_lines("./res/day08/input.txt").unwrap(), 50, 6)
    );
  }

  #[test]
  fn test_display_pixels() {
    assert_eq!(
      ".#..#.#\n\
       #.#....\n\
       .#.....\n",
      display_pixels(read_lines("./res/day08/input-test.txt").unwrap(), 7, 3)
    );
    assert_eq!(
      "#..#.###...##....##.####.#....###...##..####.####.\n\
       #..#.#..#.#..#....#.#....#....#..#.#..#.#.......#.\n\
       #..#.#..#.#..#....#.###..#....###..#....###....#..\n\
       #..#.###..#..#....#.#....#....#..#.#....#.....#...\n\
       #..#.#....#..#.#..#.#....#....#..#.#..#.#....#....\n\
       .##..#.....##...##..#....####.###...##..####.####.\n",
      display_pixels(read_lines("./res/day08/input.txt").unwrap(), 50, 6)
    );
  }
}
