use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};
use std::iter::FromIterator;

fn parse_weights(lines: Lines<BufReader<File>>) -> Vec<usize> {
  lines
    .map(|line| line.unwrap().parse::<usize>().unwrap())
    .collect()
}

fn find_fitting_groups(
  weights: &[usize],
  group_weight: usize,
  current_weights: &Vec<usize>,
) -> Vec<HashSet<usize>> {
  if group_weight == 0 {
    return vec![HashSet::from_iter(current_weights.iter().cloned())];
  } else if weights.len() == 0 {
    return vec![];
  }
  let mut groups: Vec<HashSet<usize>> = vec![];
  if weights[0] <= group_weight {
    let mut weights_with_first = current_weights.clone();
    weights_with_first.push(weights[0]);
    let groups_with_first = find_fitting_groups(
      &weights[1..],
      group_weight - weights[0],
      &weights_with_first,
    );
    groups.extend(groups_with_first);
  }
  let groups_without_first =
    find_fitting_groups(&weights[1..], group_weight, &current_weights.clone());
  groups.extend(groups_without_first);
  return groups;
}

fn get_quantum_entanglement(group: &HashSet<usize>) -> Option<usize> {
  let mut quantum_entanglement: usize = 1;
  for &weight in group {
    match quantum_entanglement.checked_mul(weight) {
      None => return None,
      Some(product) => quantum_entanglement = product,
    }
  }
  Some(quantum_entanglement)
}

pub fn find_best_quantum_entanglement(lines: Lines<BufReader<File>>) -> usize {
  let weights = parse_weights(lines);
  let group_weight: usize = weights.iter().sum::<usize>() / 3;
  let current_weights = vec![];

  let groups: Vec<HashSet<usize>> =
    find_fitting_groups(weights.as_slice(), group_weight, &current_weights);

  let mut min_weight_count = usize::MAX;
  let mut min_quantum_entanglement = usize::MAX;

  for group in &groups {
    let quantum_entanglement = get_quantum_entanglement(group);
    if quantum_entanglement.is_none() {
      continue;
    }
    if group.len() < min_weight_count
      || (group.len() == min_weight_count
        && quantum_entanglement.unwrap() < min_quantum_entanglement)
    {
      min_weight_count = group.len();
      min_quantum_entanglement = quantum_entanglement.unwrap();
    }
  }
  min_quantum_entanglement
}

#[cfg(test)]
mod tests {
  use crate::day24::find_best_quantum_entanglement;
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_best_quantum_entanglement() {
    assert_eq!(
      99,
      find_best_quantum_entanglement(read_lines("./res/day24/input-test.txt").unwrap())
    );
    assert_eq!(
      10439961859,
      find_best_quantum_entanglement(read_lines("./res/day24/input.txt").unwrap())
    );
  }
}
