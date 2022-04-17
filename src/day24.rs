use std::collections::HashSet;
use std::fs::File;
use std::io::{BufReader, Lines};
use std::iter::FromIterator;

fn parse_weights(lines: Lines<BufReader<File>>) -> Vec<usize> {
  lines
    .map(|line| line.unwrap().parse::<usize>().unwrap())
    .collect()
}

fn find_ways_to_fit(
  weights: &[usize],
  group_weight: usize,
  current_weights: &Vec<usize>,
) -> Vec<HashSet<usize>> {
  if group_weight == 0 {
    return vec![HashSet::from_iter(current_weights.iter().cloned())];
  } else if weights.len() == 0 {
    return vec![];
  }
  let mut ways: Vec<HashSet<usize>> = vec![];
  if weights[0] <= group_weight {
    let mut weights_with_first = current_weights.clone();
    weights_with_first.push(weights[0]);
    let ways_with_first = find_ways_to_fit(
      &weights[1..],
      group_weight - weights[0],
      &weights_with_first,
    );
    ways.extend(ways_with_first);
  }
  let ways_without_first = find_ways_to_fit(&weights[1..], group_weight, &current_weights.clone());
  ways.extend(ways_without_first);
  return ways;
}

fn set_intersect(set1: &HashSet<usize>, set2: &HashSet<usize>) -> bool {
  for e in set1 {
    if set2.contains(e) {
      return true;
    }
  }
  for e in set2 {
    if set1.contains(e) {
      return true;
    }
  }
  false
}

pub fn find_best_quantum_entanglement(lines: Lines<BufReader<File>>) -> usize {
  let weights = parse_weights(lines);
  let group_weight: usize = weights.iter().sum::<usize>() / 3;
  let current_weights = vec![];
  // println!("weights: {:?}", weights);
  let ways: Vec<HashSet<usize>> =
    find_ways_to_fit(weights.as_slice(), group_weight, &current_weights);
  println!("Ways: {:?}", ways.len());
  let mut min_weight_count = usize::MAX;
  let mut min_quantum_entanglement = usize::MAX;
  for i in 0..ways.len() {
    for j in (i + 1)..ways.len() {
      for k in (j + 1)..ways.len() {
        if set_intersect(&ways[i], &ways[j])
          || set_intersect(&ways[i], &ways[k])
          || set_intersect(&ways[j], &ways[k])
        {
          continue;
        }
        let quantum_entanglement_i = ways[i].iter().product::<usize>();
        if ways[i].len() < min_weight_count
          || (ways[i].len() == min_weight_count
            && quantum_entanglement_i < min_quantum_entanglement)
        {
          min_weight_count = ways[i].len();
          min_quantum_entanglement = quantum_entanglement_i;
        }
        let quantum_entanglement_j = ways[j].iter().product::<usize>();
        if ways[j].len() < min_weight_count
          || (ways[j].len() == min_weight_count
            && quantum_entanglement_j < min_quantum_entanglement)
        {
          min_weight_count = ways[j].len();
          min_quantum_entanglement = quantum_entanglement_j;
        }
        let quantum_entanglement_k = ways[k].iter().product::<usize>();
        if ways[k].len() < min_weight_count
          || (ways[k].len() == min_weight_count
            && quantum_entanglement_k < min_quantum_entanglement)
        {
          min_weight_count = ways[k].len();
          min_quantum_entanglement = quantum_entanglement_k;
        }
      }
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
    // assert_eq!(
    //   0,
    //   find_best_quantum_entanglement(read_lines("./res/day24/input.txt").unwrap())
    // );
  }
}
