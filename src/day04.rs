use md5;

fn has_leading_zeros(digest: &md5::Digest, nb_leading_zeros: usize) -> bool {
  for (i, b) in digest.iter().enumerate() {
    if *b != 0 {
      if i < nb_leading_zeros / 2 {
        return false;
      } else if 2 * i + 1 == nb_leading_zeros {
        return *b < 16;
      } else {
        return true;
      }
    }
  }
  true
}

pub fn mine_advent_coin(key: &str, nb_leading_zeros: usize) -> i32 {
  let mut decimal = 1;
  loop {
    let digest = md5::compute(format!("{}{}", key, decimal));
    if has_leading_zeros(&digest, nb_leading_zeros) {
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
