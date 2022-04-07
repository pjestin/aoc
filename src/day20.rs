use std::cmp::max;

pub fn find_lowest_house_number(min_presents: usize) -> usize {
  let mut house_number = 1;
  loop {
    let mut present_count = 0;
    let upper_bound = (house_number as f64).sqrt().floor() as usize + 1;
    for elf_number in 1..upper_bound {
      if house_number % elf_number == 0 {
        present_count += 10 * elf_number;
        if elf_number * elf_number != house_number {
          present_count += 10 * (house_number / elf_number);
        }
      }
    }
    if present_count >= min_presents {
      return house_number;
    }
    house_number += 1;
  }
}

pub fn find_lowest_house_number_stop_at_fifty(min_presents: usize) -> usize {
  let mut house_number = 1;
  loop {
    let mut present_count = 0;
    let lower_bound = max(house_number / 50, 1);
    let upper_bound = (house_number as f64).sqrt().floor() as usize + 1;
    for elf_number in lower_bound..upper_bound {
      // println!("elf_number: {}", elf_number);
      if house_number % elf_number == 0 && house_number <= elf_number * 50 {
        present_count += 11 * elf_number;
        if elf_number * elf_number != house_number {
          present_count += 11 * (house_number / elf_number);
        }
      }
    }
    if present_count >= min_presents {
      return house_number;
    }
    house_number += 1;
  }
}

#[cfg(test)]
mod tests {
  use crate::day20::{find_lowest_house_number, find_lowest_house_number_stop_at_fifty};

  #[test]
  fn test_find_lowest_house_number() {
    assert_eq!(4, find_lowest_house_number(70));
    assert_eq!(776160, find_lowest_house_number(33100000));
  }

  #[test]
  fn test_find_lowest_house_number_stop_at_fifty() {
    assert_eq!(4, find_lowest_house_number_stop_at_fifty(70));
    // assert_eq!(4, find_lowest_house_number_stop_at_fifty(33100000)); // 3603600 too high
  }
}
