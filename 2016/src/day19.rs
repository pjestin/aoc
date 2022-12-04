pub fn find_elf_with_presents(n_elves: usize) -> usize {
  let mut presents: Vec<usize> = vec![1; n_elves];
  let mut next_elves: Vec<usize> = { 0..n_elves }.map(|index| (index + 1) % n_elves).collect();
  let mut remaining_elves: usize = n_elves;
  let mut elf_index: usize = 0;

  loop {
    if remaining_elves == 1 {
      return elf_index + 1;
    }
    let next_elf_index: usize = next_elves[elf_index];
    presents[elf_index] += presents[next_elf_index];
    next_elves[elf_index] = next_elves[next_elf_index];
    remaining_elves -= 1;
    elf_index = next_elves[elf_index];
  }
}

#[cfg(test)]
mod tests {
  use crate::day19::find_elf_with_presents;

  #[test]
  fn test_find_elf_with_presents() {
    assert_eq!(3, find_elf_with_presents(5));
    assert_eq!(1815603, find_elf_with_presents(3004953));
  }
}
