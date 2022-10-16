use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};

pub fn count_tls_ips(lines: Lines<BufReader<File>>) -> usize {
  lines
    .filter(|line| {
      let unwrapped_line: &String = line.as_ref().unwrap();
      let characters: Vec<char> = unwrapped_line.chars().collect();
      let mut square_bracket_count = 0;
      let mut tls_support: bool = false;
      for i in 0..(characters.len() - 3) {
        if characters[i] == '[' {
          square_bracket_count += 1;
          continue;
        } else if characters[i] == ']' {
          square_bracket_count -= 1;
          continue;
        }
        if characters[i] != characters[i + 1]
          && characters[i] == characters[i + 3]
          && characters[i + 1] == characters[i + 2]
        {
          if square_bracket_count == 0 {
            tls_support = true
          } else {
            return false;
          }
        }
      }
      tls_support
    })
    .count()
}

fn find_abas(characters: &Vec<char>) -> HashSet<String> {
  let mut square_bracket_count = 0;
  let mut abas: HashSet<String> = HashSet::new();
  for i in 0..(characters.len() - 2) {
    if characters[i] == '[' {
      square_bracket_count += 1;
      continue;
    } else if characters[i] == ']' {
      square_bracket_count -= 1;
      continue;
    }
    if square_bracket_count == 0
      && characters[i] != characters[i + 1]
      && characters[i] == characters[i + 2]
    {
      abas.insert(format!(
        "{}{}{}",
        characters[i],
        characters[i + 1],
        characters[i + 2]
      ));
    }
  }
  abas
}

fn check_for_babs(characters: &Vec<char>, abas: &HashSet<String>) -> bool {
  let mut square_bracket_count = 0;
  for i in 0..(characters.len() - 2) {
    if characters[i] == '[' {
      square_bracket_count += 1;
      continue;
    } else if characters[i] == ']' {
      square_bracket_count -= 1;
      continue;
    }
    if square_bracket_count > 0
      && characters[i] != characters[i + 1]
      && characters[i] == characters[i + 2]
    {
      let corresponding_aba = format!(
        "{}{}{}",
        characters[i + 1],
        characters[i],
        characters[i + 1]
      );
      if abas.contains(&corresponding_aba) {
        return true;
      }
    }
  }
  false
}

pub fn count_ssl_ips(lines: Lines<BufReader<File>>) -> usize {
  lines
    .filter(|line| {
      let unwrapped_line: &String = line.as_ref().unwrap();
      let characters: Vec<char> = unwrapped_line.chars().collect();
      let abas: HashSet<String> = find_abas(&characters);
      check_for_babs(&characters, &abas)
    })
    .count()
}

#[cfg(test)]
mod tests {
  use crate::day07::{count_ssl_ips, count_tls_ips};
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_tls_ips() {
    assert_eq!(
      2,
      count_tls_ips(read_lines("./res/day07/input-test.txt").unwrap())
    );
    assert_eq!(
      110,
      count_tls_ips(read_lines("./res/day07/input.txt").unwrap())
    );
  }

  #[test]
  fn test_count_ssl_ips() {
    assert_eq!(
      0,
      count_ssl_ips(read_lines("./res/day07/input-test.txt").unwrap())
    );
    assert_eq!(
      242,
      count_ssl_ips(read_lines("./res/day07/input.txt").unwrap())
    );
  }
}
