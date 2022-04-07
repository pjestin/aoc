use regex::Regex;
use std::cmp::max;
use std::fs::File;
use std::io::{BufReader, Lines};

#[derive(Debug, Clone, Copy)]
struct Character {
  hit_points: i32,
  damage: i32,
  armor: i32,
}

#[derive(Debug, Clone)]
struct Item {
  cost: i32,
  damage: i32,
  armor: i32,
}

#[derive(Debug)]
struct Shop {
  weapons: Vec<Item>,
  armor: Vec<Item>,
  rings: Vec<Item>,
}

const SHOP_PATTERN: &str = r"(.*)\s+(\d+)\s+(\d+)\s+(\d+)";
const BOSS_PATTERN: &str = r"(.*): (\d+)";

fn parse_shop(shop_lines: Lines<BufReader<File>>) -> Shop {
  let mut items: Option<&mut Vec<Item>> = None;
  let re = Regex::new(SHOP_PATTERN).unwrap();
  let mut shop = Shop {
    weapons: vec![],
    armor: vec![],
    rings: vec![],
  };

  for line in shop_lines {
    let unwrapped_line = line.unwrap();
    if unwrapped_line.contains("Weapons:") {
      items = Some(&mut shop.weapons);
    } else if unwrapped_line.contains("Armor:") {
      items = Some(&mut shop.armor);
    } else if unwrapped_line.contains("Rings:") {
      items = Some(&mut shop.rings);
    } else if unwrapped_line.len() > 0 {
      let cap = re.captures(unwrapped_line.as_str()).unwrap();
      let cost = cap[2].parse::<i32>().unwrap();
      let damage = cap[3].parse::<i32>().unwrap();
      let armor = cap[4].parse::<i32>().unwrap();
      items.as_mut().unwrap().push(Item {
        cost: cost,
        damage: damage,
        armor: armor,
      });
    }
  }

  shop
}

fn parse_boss(lines: Lines<BufReader<File>>) -> Character {
  let re = Regex::new(BOSS_PATTERN).unwrap();
  let mut boss = Character {
    hit_points: 0,
    damage: 0,
    armor: 0,
  };

  for line in lines {
    let unwrapped_line = line.unwrap();
    let cap = re.captures(unwrapped_line.as_str()).unwrap();
    let value = cap[2].parse::<i32>().unwrap();
    match &cap[1] {
      "Hit Points" => boss.hit_points = value,
      "Damage" => boss.damage = value,
      "Armor" => boss.armor = value,
      _ => panic!("Unknown stat"),
    }
  }
  boss
}

fn get_armors(shop_armor: &Vec<Item>) -> Vec<Option<Item>> {
  let mut armors: Vec<Option<Item>> = shop_armor.iter().map(|a| Some(a.clone())).collect();
  armors.push(None);
  armors
}

fn get_ring_combinations(rings: &Vec<Item>) -> Vec<Vec<Item>> {
  let mut combinations: Vec<Vec<Item>> = vec![vec![]];
  for ring in rings {
    combinations.push(vec![ring.clone()]);
  }
  for i in 0..rings.len() {
    for j in (i + 1)..rings.len() {
      combinations.push(vec![rings[i].clone(), rings[j].clone()]);
    }
  }
  combinations
}

fn prepare_player(
  weapon: &Item,
  armor: &Option<Item>,
  ring_combination: &Vec<Item>,
) -> (Character, i32) {
  let mut cost = weapon.cost;
  let mut player = Character {
    hit_points: 100,
    damage: weapon.damage,
    armor: 0,
  };
  match armor {
    None => {}
    Some(unwrapped_armor) => {
      player.armor += unwrapped_armor.armor;
      cost += unwrapped_armor.cost;
    }
  }
  for ring in ring_combination {
    player.damage += ring.damage;
    player.armor += ring.armor;
    cost += ring.cost;
  }
  (player, cost)
}

fn fight(player: &Character, boss: &Character) -> bool {
  let mut player_copy = player.clone();
  let mut boss_copy = boss.clone();
  let mut player_turn = true;
  while player_copy.hit_points > 0 && boss_copy.hit_points > 0 {
    match player_turn {
      true => boss_copy.hit_points -= max(player_copy.damage - boss_copy.armor, 1),
      false => player_copy.hit_points -= max(boss_copy.damage - player_copy.armor, 1),
    };
    player_turn = !player_turn;
  }
  player_copy.hit_points > 0
}

pub fn find_least_gold_to_win(
  lines: Lines<BufReader<File>>,
  shop_lines: Lines<BufReader<File>>,
) -> i32 {
  let shop = parse_shop(shop_lines);
  let boss = parse_boss(lines);
  let armors = get_armors(&shop.armor);
  let ring_combinations = get_ring_combinations(&shop.rings);
  let mut min_cost = i32::MAX;

  for weapon in shop.weapons {
    for armor in &armors {
      for ring_combination in &ring_combinations {
        let (player, cost) = prepare_player(&weapon, &armor, &ring_combination);

        if cost < min_cost && fight(&player, &boss) {
          min_cost = cost;
        }
      }
    }
  }

  min_cost
}

pub fn find_most_gold_to_lose(
  lines: Lines<BufReader<File>>,
  shop_lines: Lines<BufReader<File>>,
) -> i32 {
  let shop = parse_shop(shop_lines);
  let boss = parse_boss(lines);
  let armors = get_armors(&shop.armor);
  let ring_combinations = get_ring_combinations(&shop.rings);
  let mut max_cost = 0;

  for weapon in shop.weapons {
    for armor in &armors {
      for ring_combination in &ring_combinations {
        let (player, cost) = prepare_player(&weapon, &armor, &ring_combination);

        if cost > max_cost && !fight(&player, &boss) {
          max_cost = cost;
        }
      }
    }
  }

  max_cost
}

#[cfg(test)]
mod tests {
  use crate::day21::{find_least_gold_to_win, find_most_gold_to_lose};
  use crate::file_utils::read_lines;

  #[test]
  fn test_find_least_gold_to_win() {
    assert_eq!(
      8,
      find_least_gold_to_win(
        read_lines("./res/day21/input-test.txt").unwrap(),
        read_lines("./res/day21/shop.txt").unwrap()
      )
    );
    assert_eq!(
      121,
      find_least_gold_to_win(
        read_lines("./res/day21/input.txt").unwrap(),
        read_lines("./res/day21/shop.txt").unwrap()
      )
    );
  }

  #[test]
  fn test_find_most_gold_to_lose() {
    assert_eq!(
      0,
      find_most_gold_to_lose(
        read_lines("./res/day21/input-test.txt").unwrap(),
        read_lines("./res/day21/shop.txt").unwrap()
      )
    );
    assert_eq!(
      201,
      find_most_gold_to_lose(
        read_lines("./res/day21/input.txt").unwrap(),
        read_lines("./res/day21/shop.txt").unwrap()
      )
    );
  }
}
