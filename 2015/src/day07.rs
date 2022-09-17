use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};
use std::option::Option;

struct Gate {
  args: Vec<String>,
  operation: Option<String>,
}

fn parse_gates(lines: Lines<BufReader<File>>) -> HashMap<String, Gate> {
  lines
    .map(|line| {
      let unwrapped_line = line.unwrap();
      let split_line = unwrapped_line.split(" ").collect::<Vec<&str>>();
      if split_line.len() == 3 {
        (
          split_line[2].to_string(),
          Gate {
            args: vec![split_line[0].to_string()],
            operation: None,
          },
        )
      } else if split_line.len() == 4 {
        (
          split_line[3].to_string(),
          Gate {
            args: vec![split_line[1].to_string()],
            operation: Some(split_line[0].to_string()),
          },
        )
      } else if split_line.len() == 5 {
        (
          split_line[4].to_string(),
          Gate {
            args: vec![split_line[0].to_string(), split_line[2].to_string()],
            operation: Some(split_line[1].to_string()),
          },
        )
      } else {
        panic!("Error, unknown gate format");
      }
    })
    .collect()
}

fn find_wire_value(
  wire: &str,
  gates: &HashMap<String, Gate>,
  wires: &mut HashMap<String, u16>,
) -> u16 {
  if wires.contains_key(wire) {
    return wires[wire];
  }
  if !gates.contains_key(wire) {
    panic!("Unknown wire: {}", wire);
  }

  let gate = &gates[wire];
  let arg_values: Vec<u16> = gate
    .args
    .iter()
    .map(|arg| match arg.parse::<u16>() {
      Ok(parsed_arg) => parsed_arg,
      Err(_) => find_wire_value(arg, gates, wires),
    })
    .collect();

  let wire_value = match &gate.operation {
    None => arg_values[0],
    Some(operation) => match operation.as_str() {
      "AND" => arg_values[0] & arg_values[1],
      "OR" => arg_values[0] | arg_values[1],
      "NOT" => !arg_values[0],
      "LSHIFT" => arg_values[0] << arg_values[1],
      "RSHIFT" => arg_values[0] >> arg_values[1],
      _ => panic!("Unknown operation {}", operation),
    },
  };

  wires.insert(wire.to_string(), wire_value);
  wire_value
}

pub fn compute_circuit_result(lines: Lines<BufReader<File>>) -> u16 {
  let gates: HashMap<String, Gate> = parse_gates(lines);
  let mut wires: HashMap<String, u16> = HashMap::new();
  find_wire_value("a", &gates, &mut wires)
}

pub fn compute_circuit_result_after_override(lines: Lines<BufReader<File>>) -> u16 {
  let gates: HashMap<String, Gate> = parse_gates(lines);
  let mut wires: HashMap<String, u16> = HashMap::new();
  let value_wire_a = find_wire_value("a", &gates, &mut wires);
  wires = HashMap::new();
  wires.insert("b".to_string(), value_wire_a);
  find_wire_value("a", &gates, &mut wires)
}

#[cfg(test)]
mod tests {
  use crate::day07::{compute_circuit_result, compute_circuit_result_after_override};
  use crate::file_utils::read_lines;

  #[test]
  fn test_compute_circuit_result() {
    assert_eq!(
      956,
      compute_circuit_result(read_lines("./res/day07/input.txt").unwrap())
    );
  }

  #[test]
  fn test_compute_circuit_result_after_override() {
    assert_eq!(
      40149,
      compute_circuit_result_after_override(read_lines("./res/day07/input.txt").unwrap(),)
    );
  }
}
