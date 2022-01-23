use md5;

fn has_leading_zeros(hash: &String, nb_leading_zeros: usize) -> bool {
  for (i, c) in hash.chars().enumerate() {
    if i >= nb_leading_zeros {
      return true;
    }
    if c != '0' {
      return false;
    }
  }
  return true;
}

pub fn mine_advent_coin(key: &str, nb_leading_zeros: usize) -> i32 {
  let mut decimal = 1;
  loop {
    let md5 = md5::compute(format!("{}{}", key, decimal));
    if has_leading_zeros(&format!("{:x}", md5), nb_leading_zeros) {
      return decimal;
    }
    decimal += 1;
  }
}

#[cfg(test)]
mod tests {
  use crate::day04::mine_advent_coin;

  #[test]
  fn test_mine_advent_coin() {
    assert_eq!(609043, mine_advent_coin("abcdef", 5));
    assert_eq!(282749, mine_advent_coin("yzbqklnj", 5));
    assert_eq!(9962624, mine_advent_coin("yzbqklnj", 6));
  }
}
