use json;

fn sum_json_numbers(parsed: &json::JsonValue, ignore_red: bool) -> i32 {
  if parsed.is_array() {
    parsed
      .members()
      .map(|a| sum_json_numbers(a, ignore_red))
      .sum()
  } else if parsed.is_number() {
    parsed.as_i32().unwrap()
  } else if parsed.is_object() && (!ignore_red || !parsed.entries().any(|e| e.1 == "red")) {
    parsed
      .entries()
      .map(|e| sum_json_numbers(e.1, ignore_red))
      .sum()
  } else {
    0
  }
}

pub fn parse_and_sum_json_numbers(line: &str, ignore_red: bool) -> i32 {
  let parsed: json::JsonValue = json::parse(line).unwrap();
  sum_json_numbers(&parsed, ignore_red)
}

#[cfg(test)]
mod tests {
  use crate::day12::parse_and_sum_json_numbers;
  use crate::file_utils::read_first_line;

  #[test]
  fn test_parse_and_sum_json_numbers() {
    assert_eq!(6, parse_and_sum_json_numbers("[1,2,3]", false));
    assert_eq!(6, parse_and_sum_json_numbers("{\"a\":2,\"b\":4}", false));
    assert_eq!(3, parse_and_sum_json_numbers("[[[3]]]", false));
    assert_eq!(
      3,
      parse_and_sum_json_numbers("{\"a\":{\"b\":4},\"c\":-1}", false)
    );
    assert_eq!(
      156366,
      parse_and_sum_json_numbers(&read_first_line("./res/day12/input.txt").unwrap(), false)
    );
    assert_eq!(6, parse_and_sum_json_numbers("[1,2,3]", true));
    assert_eq!(
      4,
      parse_and_sum_json_numbers("[1,{\"c\":\"red\",\"b\":2},3]", true)
    );
    assert_eq!(
      0,
      parse_and_sum_json_numbers("{\"d\":\"red\",\"e\":[1,2,3,4],\"f\":5}", true)
    );
    assert_eq!(6, parse_and_sum_json_numbers("[1,\"red\",5]", true));
    assert_eq!(
      96852,
      parse_and_sum_json_numbers(&read_first_line("./res/day12/input.txt").unwrap(), true)
    );
  }
}
