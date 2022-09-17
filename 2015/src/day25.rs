const FIRST_CODE: usize = 20151125;
const FACTOR: usize = 252533;
const DIVISOR: usize = 33554393;

fn get_next_code(code: usize) -> usize {
  (code * FACTOR) % DIVISOR
}

fn find_code_index(code_row: usize, code_col: usize) -> usize {
  ((code_row + code_col - 1) * (code_row + code_col - 2)) / 2 + code_col
}

pub fn find_code(code_row: usize, code_col: usize) -> usize {
  let code_index: usize = find_code_index(code_row, code_col);
  let mut code: usize = FIRST_CODE;
  for _ in 1..code_index {
    code = get_next_code(code);
  }
  code
}

#[cfg(test)]
mod tests {
  use crate::day25::find_code;

  #[test]
  fn test_find_least_mana_to_win() {
    assert_eq!(20151125, find_code(1, 1));
    assert_eq!(8057251, find_code(3, 2));
    assert_eq!(27995004, find_code(6, 6));
    assert_eq!(8997277, find_code(3010, 3019));
  }
}
