use std::char::from_u32;

fn get_next_char(c: char) -> char {
  if c == 'z' {
    'a'
  } else {
    from_u32(c as u32 + 1).unwrap()
  }
}

fn has_3_letter_straight(characters: &Vec<char>) -> bool {
  for i in 0..(characters.len() - 2) {
    if characters[i] != 'y'
      && characters[i] != 'z'
      && get_next_char(characters[i]) == characters[i + 1]
      && get_next_char(get_next_char(characters[i])) == characters[i + 2]
    {
      return true;
    }
  }
  false
}

fn has_i_o_l(password: &Vec<char>) -> bool {
  password.contains(&'i') || password.contains(&'o') || password.contains(&'l')
}

fn has_2_pairs(characters: &Vec<char>) -> bool {
  let mut count_pairs = 0;
  let mut i = 0;
  while i < characters.len() - 1 {
    if characters[i] == characters[i + 1] {
      count_pairs += 1;
      i += 2;
      if count_pairs == 2 {
        return true;
      }
    } else {
      i += 1;
    }
  }
  false
}

fn is_valid(characters: &Vec<char>) -> bool {
  has_3_letter_straight(characters) && !has_i_o_l(characters) && has_2_pairs(characters)
}

fn increment(characters: &mut Vec<char>) {
  for i in (0..characters.len()).rev() {
    if characters[i] != 'z' {
      characters[i] = get_next_char(characters[i]);
      for j in (i + 1)..characters.len() {
        characters[j] = 'a';
      }
      break;
    }
  }
}

pub fn find_next_password(password: &str) -> String {
  let mut characters: Vec<char> = password.chars().collect();
  loop {
    increment(&mut characters);
    if is_valid(&characters) {
      break;
    }
  }
  characters
    .iter()
    .map(|c| c.to_string())
    .collect::<Vec<String>>()
    .join("")
}

pub fn find_next_next_password(password: &str) -> String {
  let mut characters: Vec<char> = password.chars().collect();
  let mut found_valid = false;
  loop {
    increment(&mut characters);
    if is_valid(&characters) {
      if found_valid {
        break;
      } else {
        found_valid = true;
      }
    }
  }
  characters
    .iter()
    .map(|c| c.to_string())
    .collect::<Vec<String>>()
    .join("")
}

#[cfg(test)]
mod tests {
  use crate::day11::{find_next_next_password, find_next_password};

  #[test]
  fn test_find_next_password() {
    assert_eq!("abcdffaa", find_next_password("abcdefgh"));
    assert_eq!("ghjaabcc", find_next_password("ghijklmn"));
    assert_eq!("cqjxxyzz", find_next_password("cqjxjnds"));
  }

  #[test]
  fn test_find_next_next_password() {
    assert_eq!("cqkaabcc", find_next_next_password("cqjxjnds"));
  }
}
