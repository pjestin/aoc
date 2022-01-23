fn iterate(digits: String) -> String {
  let mut previous = '\0';
  let mut count = 1;
  let mut new_digits: Vec<String> = vec![];
  for c in digits.chars() {
    if c == previous {
      count += 1;
    } else if previous != '\0' {
      new_digits.push(count.to_string());
      new_digits.push(previous.to_string());
      count = 1;
    }
    previous = c;
  }
  new_digits.push(count.to_string());
  new_digits.push(previous.to_string());
  new_digits.join("")
}

pub fn find_look_and_say_length(digits: &str, nb_iterations: usize) -> usize {
  let mut digit_string = digits.to_owned();
  for _ in 0..nb_iterations {
    digit_string = iterate(digit_string);
  }
  digit_string.len()
}

#[cfg(test)]
mod tests {
  use crate::day10::find_look_and_say_length;

  #[test]
  fn test_find_look_and_say_length() {
    assert_eq!(6, find_look_and_say_length("1", 5));
    assert_eq!(360154, find_look_and_say_length("1113122113", 40));
    assert_eq!(5103798, find_look_and_say_length("1113122113", 50));
  }
}
