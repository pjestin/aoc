use regex::Regex;
use std::cmp::{max, min};
use std::collections::HashMap;
use std::fs::File;
use std::io::{BufReader, Lines};

const GIVE_PATTERN: &str = r"bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)";
const VALUE_PATTERN: &str = r"value (\d+) goes to bot (\d+)";

#[derive(Eq, PartialEq, Clone, Debug)]
enum TargetType {
  Bot,
  Output,
}

impl TargetType {
  fn from_string(s: &str) -> TargetType {
    match s.as_ref() {
      "bot" => TargetType::Bot,
      "output" => TargetType::Output,
      _ => panic!("unable to parse target type"),
    }
  }
}

#[derive(Clone, Debug)]
struct Bot {
  values: Vec<usize>,
  low_target_type: TargetType,
  low_target_id: usize,
  high_target_type: TargetType,
  high_target_id: usize,
}

fn insert_empty_bot(bots: &mut HashMap<usize, Bot>, bot_id: usize) {
  if !bots.contains_key(&bot_id) {
    bots.insert(
      bot_id,
      Bot {
        values: Vec::new(),
        low_target_type: TargetType::Bot,
        low_target_id: 0,
        high_target_type: TargetType::Bot,
        high_target_id: 0,
      },
    );
  }
}

fn parse_bots(lines: Lines<BufReader<File>>) -> HashMap<usize, Bot> {
  let give_regex = Regex::new(GIVE_PATTERN).unwrap();
  let value_regex = Regex::new(VALUE_PATTERN).unwrap();
  let mut bots: HashMap<usize, Bot> = HashMap::new();
  for line in lines {
    let unwrapped_line = line.unwrap();

    if give_regex.is_match(&unwrapped_line) {
      let captures = give_regex.captures(&unwrapped_line).unwrap();
      let source_bot_id: usize = captures[1].parse::<usize>().unwrap();
      let low_target_type = TargetType::from_string(&captures[2]);
      let low_target_id: usize = captures[3].parse::<usize>().unwrap();
      let high_target_type = TargetType::from_string(&captures[4]);
      let high_target_id: usize = captures[5].parse::<usize>().unwrap();

      insert_empty_bot(&mut bots, source_bot_id);

      let mut bot: &mut Bot = bots.get_mut(&source_bot_id).unwrap();
      bot.low_target_type = low_target_type;
      bot.low_target_id = low_target_id;
      bot.high_target_type = high_target_type;
      bot.high_target_id = high_target_id;
    } else if value_regex.is_match(&unwrapped_line) {
      let captures = value_regex.captures(&unwrapped_line).unwrap();
      let value = captures[1].parse::<usize>().unwrap();
      let target_bot_id = captures[2].parse::<usize>().unwrap();

      insert_empty_bot(&mut bots, target_bot_id);

      bots.get_mut(&target_bot_id).unwrap().values.push(value);
    } else {
      panic!("unable to parse line {}", unwrapped_line);
    }
  }
  bots
}

pub fn process_microchips(lines: Lines<BufReader<File>>, stop_at_given_values: bool) -> usize {
  let mut bots: HashMap<usize, Bot> = parse_bots(lines);
  let mut outputs: HashMap<usize, usize> = HashMap::new();

  loop {
    let bot_ids: Vec<usize> = bots.keys().map(|&bot_id| bot_id).collect();
    let mut op_count = 0;
    for bot_id in bot_ids {
      let bot = bots[&bot_id].clone();
      if bot.values.len() == 2 {
        op_count += 1;
        let low = min(bot.values[0], bot.values[1]);
        let high = max(bot.values[0], bot.values[1]);

        if stop_at_given_values && low == 17 && high == 61 {
          return bot_id;
        }

        if bot.low_target_type == TargetType::Bot {
          bots.get_mut(&bot.low_target_id).unwrap().values.push(low);
        } else {
          outputs.insert(bot.low_target_id, low);
        }
        if bot.high_target_type == TargetType::Bot {
          bots.get_mut(&bot.high_target_id).unwrap().values.push(high);
        } else {
          outputs.insert(bot.high_target_id, high);
        }
        bots.get_mut(&bot_id).unwrap().values = Vec::new();
      }
    }

    if op_count == 0 {
      break;
    }
  }

  outputs[&0] * outputs[&1] * outputs[&2]
}

#[cfg(test)]
mod tests {
  use crate::day10::process_microchips;
  use crate::file_utils::read_lines;

  #[test]
  fn test_process_microchips() {
    assert_eq!(
      30,
      process_microchips(read_lines("./res/day10/input-test.txt").unwrap(), false)
    );
    assert_eq!(
      101,
      process_microchips(read_lines("./res/day10/input.txt").unwrap(), true)
    );
    assert_eq!(
      37789,
      process_microchips(read_lines("./res/day10/input.txt").unwrap(), false)
    );
  }
}
