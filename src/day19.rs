use regex::Regex;
use std::collections::{HashMap, HashSet};
use std::fs::File;
use std::io::{BufReader, Lines};

const PATTERN: &str = r"(\w+) => (\w+)";

fn parse_replacements(lines: Lines<BufReader<File>>) -> (HashMap<String, Vec<String>>, String) {
  let mut replacements = HashMap::<String, Vec<String>>::new();
  let mut molecule = String::new();
  let re = Regex::new(PATTERN).unwrap();
  let mut found_break = false;
  for line in lines {
    let unwrapped_line = line.unwrap();
    let line_str = unwrapped_line.as_str();
    if line_str.len() == 0 {
      found_break = true;
      continue;
    }
    if found_break {
      molecule = line_str.to_owned();
    } else {
      let cap = re.captures(line_str).unwrap();
      let sym_1 = cap[1].to_owned();
      let sym_2 = cap[2].to_owned();
      if !replacements.contains_key(&sym_1) {
        replacements.insert(sym_1.clone(), vec![]);
      }
      replacements.get_mut(&sym_1).unwrap().push(sym_2);
    }
  }
  (replacements, molecule)
}

fn replace_nth(s: &String, n: usize, sym: &String, rep: &String) -> Option<String> {
  let s_chars: Vec<char> = s.chars().collect();
  let sym_chars: Vec<char> = sym.chars().collect();
  let mut mat_count = 0;
  for i in 0..(s.len() - sym.len() + 1) {
    let mut mat = true;
    for j in 0..sym.len() {
      if s_chars.get(i + j).unwrap() != sym_chars.get(j).unwrap() {
        mat = false;
        break;
      }
    }
    if mat {
      if mat_count == n {
        let replaced = format!(
          "{}{}{}",
          s[0..i].to_owned(),
          rep,
          s[(i + sym.len())..s.len()].to_owned()
        );
        return Some(replaced);
      }
      mat_count += 1;
    }
  }
  None
}

pub fn count_distinct_molecules(lines: Lines<BufReader<File>>) -> usize {
  let (replacements, molecule): (HashMap<String, Vec<String>>, String) = parse_replacements(lines);
  let mut distinct_molecules: HashSet<String> = HashSet::new();
  for (sym, reps) in replacements.iter() {
    for rep in reps {
      let mut rep_count = 0;
      loop {
        let replaced = replace_nth(&molecule, rep_count, sym, rep);
        match replaced {
          Some(replaced_string) => {
            distinct_molecules.insert(replaced_string);
          }
          None => {
            break;
          }
        }
        rep_count += 1;
      }
    }
  }
  distinct_molecules.len()
}

#[cfg(test)]
mod tests {
  use crate::day19::count_distinct_molecules;
  use crate::file_utils::read_lines;

  #[test]
  fn test_count_distinct_molecules() {
    assert_eq!(
      4,
      count_distinct_molecules(read_lines("./res/day19/input-test.txt").unwrap())
    );
    assert_eq!(
      576,
      count_distinct_molecules(read_lines("./res/day19/input.txt").unwrap())
    );
  }
}
