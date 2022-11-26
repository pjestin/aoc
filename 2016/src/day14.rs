use md5;
use std::collections::HashMap;

const TARGET_KEY_NUMBER: usize = 64;

struct MD5Cache {
  cache: HashMap<usize, String>,
  salt: String,
  stretch: usize,
}

impl MD5Cache {
  fn get_hex_char(&self, nibble: u8) -> char {
    // This is not very pretty, but it's much faster than a format!("{:x}", digest)
    match nibble {
      0x0 => '0',
      0x1 => '1',
      0x2 => '2',
      0x3 => '3',
      0x4 => '4',
      0x5 => '5',
      0x6 => '6',
      0x7 => '7',
      0x8 => '8',
      0x9 => '9',
      0xa => 'a',
      0xb => 'b',
      0xc => 'c',
      0xd => 'd',
      0xe => 'e',
      0xf => 'f',
      _ => panic!("Unexpected value for nibble: {}", nibble),
    }
  }

  fn convert(&self, digest: &md5::Digest) -> String {
    let mut result: Vec<char> = vec!['0'; 32];
    for i in 0..16 {
      result[i * 2] = self.get_hex_char((digest[i] & 0xf0) >> 4);
      result[i * 2 + 1] = self.get_hex_char(digest[i] & 0xf);
    }
    result.iter().collect()
  }

  pub fn get_hash(&mut self, index: usize) -> &String {
    if !self.cache.contains_key(&index) {
      let mut hash: String = format!("{}{}", self.salt, index);
      for _ in 0..(self.stretch + 1) {
        hash = self.convert(&md5::compute(hash));
      }

      self.cache.insert(index, hash);
    }

    &self.cache[&index]
  }
}

fn find_consecutive_chars(s: &str, number: usize) -> Option<char> {
  let chars: Vec<char> = s.chars().collect();
  let mut previous_char: char = '\0';
  let mut consecutive: usize = 1;

  for i in 0..s.len() {
    let c = chars[i];
    if c == previous_char {
      consecutive += 1;
      if consecutive == number {
        return Some(c);
      }
    } else {
      consecutive = 1;
    }
    previous_char = c;
  }

  None
}

pub fn find_key_index(salt: &str, stretch: usize) -> usize {
  let mut index: usize = 0;
  let mut key_number: usize = 0;
  let mut quintuplet_index: usize = 0;
  let mut quintuplets: HashMap<char, usize> = HashMap::new();
  let mut md5_cache = MD5Cache {
    cache: HashMap::new(),
    salt: salt.to_owned(),
    stretch,
  };

  loop {
    while quintuplet_index <= index + 1000 {
      let quintuplet_hash: &String = md5_cache.get_hash(quintuplet_index);
      match find_consecutive_chars(&quintuplet_hash, 5) {
        Some(q) => {
          quintuplets.insert(q, quintuplet_index);
        }
        None => (),
      };
      quintuplet_index += 1;
    }

    let current_hash: &String = md5_cache.get_hash(index);
    let triplet = find_consecutive_chars(&current_hash, 3);

    match triplet {
      Some(t) => {
        if quintuplets.contains_key(&t) && quintuplets[&t] > index {
          key_number += 1;
          if key_number == TARGET_KEY_NUMBER {
            return index;
          }
        }
      }
      None => (),
    }

    index += 1;
  }
}

#[cfg(test)]
mod tests {
  use crate::day14::find_key_index;

  #[test]
  fn test_find_key_index() {
    assert_eq!(22728, find_key_index("abc", 0));
    assert_eq!(16106, find_key_index("zpqevtbw", 0));
  }

  #[test]
  fn test_find_key_index_stretched() {
    assert_eq!(22551, find_key_index("abc", 2016));
    assert_eq!(22423, find_key_index("zpqevtbw", 2016));
  }
}
