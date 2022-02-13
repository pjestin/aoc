use regex::Regex;
use std::cmp::max;
use std::fs::File;
use std::io::{BufReader, Lines};

const PATTERN: &str =
  r"(\w+): capacity (-?\d+), durability (-?\d+), flavor (-?\d+), texture (-?\d+), calories (-?\d+)";

const TOTAL_WEIGHT: i64 = 100;
const CALORY_CONSTRAINT: i64 = 500;

fn parse_ingredients(lines: Lines<BufReader<File>>) -> Vec<Vec<i64>> {
  let re = Regex::new(PATTERN).unwrap();
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      vec![
        cap[2].parse::<i64>().unwrap(),
        cap[3].parse::<i64>().unwrap(),
        cap[4].parse::<i64>().unwrap(),
        cap[5].parse::<i64>().unwrap(),
        cap[6].parse::<i64>().unwrap(),
      ]
    })
    .collect()
}

fn find_combinations(size: usize, remaining: i64) -> Vec<Vec<i64>> {
  if size == 1 {
    return vec![vec![remaining]];
  }
  let mut combinations: Vec<Vec<i64>> = vec![];
  for weight in 0..(remaining + 1) {
    let remaining_weight = remaining - weight;
    let remaining_weight_combinations: Vec<Vec<i64>> =
      find_combinations(size - 1, remaining_weight);
    for remaining_weight_combination in remaining_weight_combinations {
      combinations.push([vec![weight], remaining_weight_combination].concat());
    }
  }
  combinations
}

fn calculate_score(ingredients: &Vec<Vec<i64>>, combination: &Vec<i64>) -> i64 {
  let mut score: i64 = 1;
  for field_index in 0..4 {
    let mut field_score: i64 = 0;
    for ing_index in 0..ingredients.len() {
      field_score += ingredients[ing_index][field_index] * combination[ing_index];
    }
    score *= max(0, field_score);
  }
  score
}

pub fn find_best_cookie(lines: Lines<BufReader<File>>) -> i64 {
  let ingredients: Vec<Vec<i64>> = parse_ingredients(lines);
  let combinations: Vec<Vec<i64>> = find_combinations(ingredients.len(), TOTAL_WEIGHT);
  combinations
    .iter()
    .map(|combination| calculate_score(&ingredients, &combination))
    .max()
    .unwrap()
}

fn verifies_calorie_constraint(ingredients: &Vec<Vec<i64>>, combination: &Vec<i64>) -> bool {
  ingredients
    .iter()
    .enumerate()
    .map(|(ing_index, ingredient)| ingredient[4] * combination[ing_index])
    .sum::<i64>()
    == CALORY_CONSTRAINT
}

pub fn find_best_cookie_calorie_constraint(lines: Lines<BufReader<File>>) -> i64 {
  let ingredients: Vec<Vec<i64>> = parse_ingredients(lines);
  let combinations: Vec<Vec<i64>> = find_combinations(ingredients.len(), TOTAL_WEIGHT);
  combinations
    .iter()
    .filter(|combination| verifies_calorie_constraint(&ingredients, &combination))
    .map(|combination| calculate_score(&ingredients, &combination))
    .max()
    .unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day15::{find_best_cookie, find_best_cookie_calorie_constraint};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_best_cookie() {
    assert_eq!(
      62842880,
      find_best_cookie(read_lines("./res/day15/input-test.txt").unwrap())
    );
    assert_eq!(
      21367368,
      find_best_cookie(read_lines("./res/day15/input.txt").unwrap())
    );
  }

  #[test]
  fn test_find_best_cookie_calorie_constraint() {
    assert_eq!(
      57600000,
      find_best_cookie_calorie_constraint(read_lines("./res/day15/input-test.txt").unwrap())
    );
    assert_eq!(
      1766400,
      find_best_cookie_calorie_constraint(read_lines("./res/day15/input.txt").unwrap())
    );
  }
}
