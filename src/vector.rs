use std::fmt;
use std::hash::Hash;
use std::marker::Copy;

#[derive(Clone, Copy, Eq, Hash, PartialEq)]
pub struct Vector {
  pub x: i32,
  pub y: i32,
}

impl fmt::Display for Vector {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "({}, {})", self.x, self.y)
  }
}

impl fmt::Debug for Vector {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    f.debug_struct("Point")
      .field("x", &self.x)
      .field("y", &self.y)
      .finish()
  }
}

impl Vector {
  pub fn add(&mut self, other: &Vector) -> &Vector {
    self.x += other.x;
    self.y += other.y;
    self
  }
}

#[cfg(test)]
mod tests {
  use crate::vector::Vector;
  use std::collections::HashSet;

  #[test]
  fn test_vector_to_string() {
    assert_eq!("(1, -2)", format!("{}", Vector { x: 1, y: -2 }));
  }

  #[test]
  fn test_vector_eq() {
    let a = Vector { x: 123, y: -56787 };
    let b = Vector { x: 123, y: -56787 };
    let c = Vector { x: 123, y: 1 };
    assert!(a == b);
    assert!(a != c);
  }

  #[test]
  fn test_vector_hash() {
    let a = Vector { x: 123, y: -56787 };
    let b = Vector { x: -56, y: 43 };
    let c = Vector { x: -56, y: 43 };
    let mut set = HashSet::new();
    set.insert(a);
    set.insert(b);
    set.insert(c);
    assert_eq!(2, set.len());
  }

  #[test]
  fn test_vector_copy() {
    let a = Vector { x: 123, y: -56787 };
    let mut b = a;
    b.x = 456;
    assert_eq!(Vector { x: 123, y: -56787 }, a);
    assert_eq!(Vector { x: 456, y: -56787 }, b);
  }

  #[test]
  fn test_vector_add() {
    let mut a = Vector { x: 123, y: -56787 };
    a.add(&Vector { x: 2, y: -1 });
    assert_eq!(Vector { x: 125, y: -56788 }, a);
  }
}
