pub fn modulo(a: i64, b: i64) -> i64 {
  return ((a % b) + b) % b;
}

#[cfg(test)]
mod tests {
  use crate::modulo::modulo;

  #[test]
  fn test_mod() {
    assert_eq!(1, modulo(1, 2));
    assert_eq!(1, modulo(-1, 2));
    assert_eq!(2, modulo(26, 3));
    assert_eq!(1285, modulo(-47863, 4468));
  }
}
