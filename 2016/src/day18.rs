fn parse_row(map: &str) -> Vec<bool> {
  map
    .chars()
    .map(|c| match c {
      '.' => true,
      '^' => false,
      _ => panic!("Unrecognized character: {}", c),
    })
    .collect()
}

fn get_next_row(current_row: &Vec<bool>) -> Vec<bool> {
  let n: usize = current_row.len();
  let mut next_row: Vec<bool> = vec![false; n];
  next_row[0] = current_row[1];
  next_row[n - 1] = current_row[n - 2];
  for i in 1..(n - 1) {
    next_row[i] = !(current_row[i - 1] ^ current_row[i + 1]);
  }
  next_row
}

pub fn count_safe_tiles(input: &str, n_rows: usize) -> usize {
  let mut current_row: Vec<bool> = parse_row(input);
  let mut n_safe_tiles: usize = current_row.iter().filter(|&tile| *tile).count();

  for _ in 1..n_rows {
    let next_row: Vec<bool> = get_next_row(&current_row);
    n_safe_tiles += next_row.iter().filter(|&tile| *tile).count();
    current_row = next_row;
  }

  n_safe_tiles
}

#[cfg(test)]
mod tests {
  use crate::day18::count_safe_tiles;

  #[test]
  fn test_count_safe_tiles() {
    assert_eq!(6, count_safe_tiles("..^^.", 3));
    assert_eq!(38, count_safe_tiles(".^^.^.^^^^", 10));
    assert_eq!(2035, count_safe_tiles(".^..^....^....^^.^^.^.^^.^.....^.^..^...^^^^^^.^^^^.^.^^^^^^^.^^^^^..^.^^^.^^..^.^^.^....^.^...^^.^.", 40));
    assert_eq!(20000577, count_safe_tiles(".^..^....^....^^.^^.^.^^.^.....^.^..^...^^^^^^.^^^^.^.^^^^^^^.^^^^^..^.^^^.^^..^.^^.^....^.^...^^.^.", 400000));
  }
}
