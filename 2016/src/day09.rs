use regex::Regex;

const COMPRESSION_PATTERN: &str = r"\((\d+)x(\d+)\)";

fn parse_marker(marker: &String) -> (usize, usize) {
  let re = Regex::new(COMPRESSION_PATTERN).unwrap();
  let captures = re.captures(&marker).unwrap();
  let length = captures[1].parse::<usize>().unwrap();
  let repeat = captures[2].parse::<usize>().unwrap();
  (length, repeat)
}

pub fn decompressed_length(line: &str, recurse: bool) -> usize {
  let mut index: usize = 0;
  let mut result: usize = 0;
  let mut marker_begin: usize = 0;
  let characters: Vec<char> = line.chars().collect();
  while index < characters.len() {
    if characters[index] == '(' {
      marker_begin = index;
    } else if characters[index] == ')' {
      let marker: String = line[marker_begin..(index + 1)].to_string();
      let (length, repeat) = parse_marker(&marker);
      if recurse {
        let substring: String = line[(index + 1)..(index + length + 1)].to_string();
        let sub_string_decompressed_length = decompressed_length(&substring, true);
        result += sub_string_decompressed_length * repeat;
      } else {
        result += length * repeat;
      }
      result -= index - marker_begin;
      index += length + 1;
      continue;
    }
    index += 1;
    result += 1;
  }
  result
}

#[cfg(test)]
mod tests {
  use crate::day09::decompressed_length;
  use crate::file_utils::read_first_line;

  #[test]
  fn test_decompressed_length() {
    assert_eq!(
      18,
      decompressed_length(
        &read_first_line("./res/day09/input-test.txt").unwrap(),
        false
      )
    );
    assert_eq!(
      70186,
      decompressed_length(&read_first_line("./res/day09/input.txt").unwrap(), false)
    );
  }

  #[test]
  fn test_decompressed_length_recursive() {
    assert_eq!(
      20,
      decompressed_length(
        &read_first_line("./res/day09/input-test.txt").unwrap(),
        true
      )
    );
    assert_eq!(
      10915059201,
      decompressed_length(&read_first_line("./res/day09/input.txt").unwrap(), true)
    );
  }
}
