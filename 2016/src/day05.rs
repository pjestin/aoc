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

pub fn find_password(door_id: &str) -> String {
  let mut password_characters: Vec<char> = Vec::new();
  let mut index = 0;
  while password_characters.len() < 8 {
    let digest = md5::compute(format!("{}{}", door_id, index));
    if has_leading_zeros(&digest, 5) {
      let hex_digest: String = format!("{:x}", digest);
      password_characters.push(hex_digest.chars().nth(5).unwrap());
    }
    index += 1;
  }
  password_characters.iter().collect()
}

pub fn find_password_with_position(door_id: &str) -> String {
  let mut password_characters = vec!['\0'; 8];
  let mut index = 0;
  let mut accepted_character_count = 0;
  while accepted_character_count < 8 {
    let digest = md5::compute(format!("{}{}", door_id, index));
    if has_leading_zeros(&digest, 5) {
      let hex_digest: String = format!("{:x}", digest);
      let position = hex_digest.chars().nth(5).unwrap().to_digit(16).unwrap() as usize;
      if position > 7 || password_characters[position] != '\0' {
        index += 1;
        continue;
      }
      password_characters[position] = hex_digest.chars().nth(6).unwrap();
      accepted_character_count += 1;
    }
    index += 1;
  }
  password_characters.iter().collect()
}

#[cfg(test)]
mod tests {
  use crate::day05::{find_password, find_password_with_position};
  use crate::file_utils::read_first_line;

  #[test]
  fn test_find_password() {
    assert_eq!(
      "18f47a30",
      find_password(&read_first_line("./res/day05/input-test.txt").unwrap())
    );
    assert_eq!(
      "2414bc77",
      find_password(&read_first_line("./res/day05/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_password_with_position() {
    assert_eq!(
      "05ace8e3",
      find_password_with_position(&read_first_line("./res/day05/input-test.txt").unwrap())
    );
    assert_eq!(
      "437e60fc",
      find_password_with_position(&read_first_line("./res/day05/input.txt").unwrap())
    );
  }
}
