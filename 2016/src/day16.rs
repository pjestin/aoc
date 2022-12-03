fn expand(a: String) -> String {
  let n: usize = a.len();
  let mut b_chars: Vec<char> = a.clone().chars().collect();

  for i in 0..(n / 2) {
    let tmp: char = b_chars[i];
    b_chars[i] = b_chars[n - 1 - i];
    b_chars[n - 1 - i] = tmp;
  }

  for i in 0..n {
    b_chars[i] = match b_chars[i] {
      '0' => '1',
      '1' => '0',
      _ => panic!("unknown character: {}", b_chars[i]),
    }
  }

  format!("{}0{}", a, b_chars.iter().collect::<String>())
}

fn get_checksum(data: String) -> String {
  if data.len() % 2 == 1 {
    return data;
  }

  let chars: Vec<char> = data.chars().collect();
  let result: String = (0..(data.len() / 2))
    .map(|i| {
      if chars[2 * i] == chars[2 * i + 1] {
        '1'
      } else {
        '0'
      }
    })
    .collect();
  get_checksum(result)
}

pub fn find_data_checksum(input: &str, data_length: usize) -> String {
  let mut data: String = input.to_owned();

  while data.len() < data_length {
    data = expand(data);
  }

  get_checksum(data[..data_length].to_owned())
}

#[cfg(test)]
mod tests {
  use crate::day16::find_data_checksum;

  #[test]
  fn test_find_data_checksum() {
    assert_eq!("01100", find_data_checksum("10000", 20));
    assert_eq!(
      "00000100100001100",
      find_data_checksum("11011110011011101", 272)
    );
    assert_eq!(
      "00011010100010010",
      find_data_checksum("11011110011011101", 35651584)
    );
  }
}
