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
  if s.len() < sym.len() {
    return None;
  }
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

fn replaced_molecules(
  molecule: &String,
  replacements: &HashMap<String, Vec<String>>,
) -> HashSet<String> {
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
  distinct_molecules
}

pub fn count_distinct_molecules(lines: Lines<BufReader<File>>) -> usize {
  let (replacements, molecule): (HashMap<String, Vec<String>>, String) = parse_replacements(lines);
  let distinct_molecules = replaced_molecules(&molecule, &replacements);
  distinct_molecules.len()
}

/* Part 2
  t = 292 total atoms (Regex for [A-Z])
  c = 36 Rn-Ar couples
  y = 6 Y

  Each trasformation produces either:
  * 2 atoms from 1
  * a pattern .Rn.(Y.)*Ar (with . any atom)

  So each atom is either the result of a 1 -> 2 transformation, or a 1 -> 4, 1 -> 6, etc in case of the pattern trasnformation.

  For each Rn-Ar couple, there was a pattern transformation. For each Y atom, there were an additional 2 atoms added to the pattern.
  Hence, the number of additional atoms generated through the pattern transformation is a = 3c + 2y. It took c steps to generate those atoms.

  The rest of the atoms were generated with 1 -> 2 transformation, producing 1 additional atom per step, let it be notated as b.
  Note that t = a + b + 1.

  The total number of steps s is the sum of the steps for those 2 transformations:
  s = b + c
    = t - a - 1 + c
    = t - (3c + 2y) - 1 + c
  s = t - 2c - 2y - 1
*/

pub fn count_minimal_steps(lines: Lines<BufReader<File>>) -> usize {
  let (_, molecule): (_, String) = parse_replacements(lines);
  let re = Regex::new("[A-Z]").unwrap();
  let t = re.find_iter(molecule.as_str()).count();
  let c = molecule.as_str().matches("Rn").count();
  let y = molecule.matches("Y").count();
  t - 2 * c - 2 * y - 1
}

#[cfg(test)]
mod tests {
  use crate::day19::{count_distinct_molecules, count_minimal_steps};
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

  #[test]
  fn test_count_minimal_steps() {
    assert_eq!(
      2,
      count_minimal_steps(read_lines("./res/day19/input-test.txt").unwrap())
    );
    assert_eq!(
      207,
      count_minimal_steps(read_lines("./res/day19/input.txt").unwrap())
    );
  }
}
