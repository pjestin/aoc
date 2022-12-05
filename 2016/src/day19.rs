use std::collections::VecDeque;

pub fn find_elf_with_presents(n_elves: usize) -> usize {
  let mut elves: VecDeque<usize> = VecDeque::from_iter(1..=n_elves);

  while elves.len() > 1 {
    let first: usize = elves.pop_front().unwrap();
    let _second: usize = elves.pop_front().unwrap();
    elves.push_back(first);
  }

  *elves.front().unwrap()
}

pub fn find_elf_with_presents_across(n_elves: usize) -> usize {
  let mut queue_a: VecDeque<usize> = VecDeque::from_iter(1..=(n_elves / 2));
  let mut queue_b: VecDeque<usize> = VecDeque::from_iter((n_elves / 2 + 1)..=n_elves);

  while queue_a.len() >= 1 {
    let first: usize = queue_a.pop_front().unwrap();
    let _second: usize = queue_b.pop_front().unwrap();
    queue_b.push_back(first);

    if queue_b.len() - queue_a.len() >= 2 {
      let balanced_elf: usize = queue_b.pop_front().unwrap();
      queue_a.push_back(balanced_elf);
    }
  }

  *queue_b.front().unwrap()
}

#[cfg(test)]
mod tests {
  use crate::day19::{find_elf_with_presents, find_elf_with_presents_across};

  #[test]
  fn test_find_elf_with_presents() {
    assert_eq!(3, find_elf_with_presents(5));
    assert_eq!(1815603, find_elf_with_presents(3004953));
  }

  #[test]
  fn test_find_elf_with_presents_across() {
    assert_eq!(2, find_elf_with_presents_across(5));
    assert_eq!(1410630, find_elf_with_presents_across(3004953));
  }
}
