pub fn count_floors(line: &str) -> i32 {
  let mut floor: i32 = 0;
  for c in line.chars() {
    if c == '(' {
      floor += 1;
    } else if c == ')' {
      floor -= 1;
    }
  }
  return floor;
}

pub fn first_basement_character(line: &str) -> i32 {
  let mut floor: i32 = 0;
  for (i, c) in line.chars().enumerate() {
    if c == '(' {
      floor += 1;
    } else if c == ')' {
      floor -= 1;
      if floor < 0 {
        return (i + 1) as i32;
      }
    }
  }
  return -1;
}

#[cfg(test)]
mod tests {
  use crate::day01::count_floors;
  use crate::day01::first_basement_character;
  use crate::file_utils::read_first_line;

  #[test]
  fn test_count_floors() {
    assert_eq!(0, count_floors("(())"));
    assert_eq!(3, count_floors("(()(()("));
    let first_line = &read_first_line("./res/day01/input.txt").unwrap();
    assert_eq!(74, count_floors(first_line));
  }

  #[test]
  fn test_first_basement_character() {
    assert_eq!(1, first_basement_character(")"));
    assert_eq!(5, first_basement_character("()())"));
    let first_line = &read_first_line("./res/day01/input.txt").unwrap();
    assert_eq!(1795, first_basement_character(first_line));
  }
}
