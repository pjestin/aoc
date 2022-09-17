use std::cmp::max;
use std::cmp::Ordering;
use std::collections::{BinaryHeap, HashSet};

#[derive(Copy, Clone, Debug, Eq, Hash, PartialEq)]
struct Character {
  hit_points: i32,
  damage: i32,
  mana: i32,
}

#[derive(Copy, Clone, Eq, Hash, PartialEq)]
struct State {
  cost: i32,
  player: Character,
  boss: Character,
  shield: i32,
  poison: i32,
  recharge: i32,
}

impl Ord for State {
  fn cmp(&self, other: &Self) -> Ordering {
    other
      .cost
      .cmp(&self.cost)
      .then_with(|| other.boss.hit_points.cmp(&self.boss.hit_points))
  }
}

impl PartialOrd for State {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.cmp(other))
  }
}

fn apply_attrition(state: &mut State, attrition: bool) {
  if attrition {
    state.player.hit_points -= 1;
  }
}

fn apply_effects(state: &mut State) {
  state.shield = max(0, state.shield - 1);
  if state.poison > 0 {
    state.boss.hit_points -= 3;
  }
  state.poison = max(0, state.poison - 1);
  if state.recharge > 0 {
    state.player.mana += 101;
  }
  state.recharge = max(0, state.recharge - 1);
}

fn boss_attack(state: &mut State) {
  if state.shield > 0 {
    state.player.hit_points -= max(state.boss.damage - 7, 1);
  } else {
    state.player.hit_points -= state.boss.damage;
  }
}

fn cast_magic_missile(state: &State, heap: &mut BinaryHeap<State>) {
  if state.player.mana >= 53 {
    heap.push(State {
      cost: state.cost + 53,
      player: Character {
        hit_points: state.player.hit_points,
        damage: 0,
        mana: state.player.mana - 53,
      },
      boss: Character {
        hit_points: state.boss.hit_points - 4,
        damage: state.boss.damage,
        mana: 0,
      },
      shield: state.shield,
      poison: state.poison,
      recharge: state.recharge,
    });
  }
}

fn cast_drain(state: &State, heap: &mut BinaryHeap<State>) {
  if state.player.mana >= 73 {
    heap.push(State {
      cost: state.cost + 73,
      player: Character {
        hit_points: state.player.hit_points + 2,
        damage: 0,
        mana: state.player.mana - 73,
      },
      boss: Character {
        hit_points: state.boss.hit_points - 2,
        damage: state.boss.damage,
        mana: 0,
      },
      shield: state.shield,
      poison: state.poison,
      recharge: state.recharge,
    });
  }
}

fn cast_shield(state: &State, heap: &mut BinaryHeap<State>) {
  if state.player.mana >= 113 && state.shield == 0 {
    heap.push(State {
      cost: state.cost + 113,
      player: Character {
        hit_points: state.player.hit_points,
        damage: 0,
        mana: state.player.mana - 113,
      },
      boss: Character {
        hit_points: state.boss.hit_points,
        damage: state.boss.damage,
        mana: 0,
      },
      shield: 6,
      poison: state.poison,
      recharge: state.recharge,
    });
  }
}

fn cast_poison(state: &State, heap: &mut BinaryHeap<State>) {
  if state.player.mana >= 173 && state.poison == 0 {
    heap.push(State {
      cost: state.cost + 173,
      player: Character {
        hit_points: state.player.hit_points,
        damage: 0,
        mana: state.player.mana - 173,
      },
      boss: Character {
        hit_points: state.boss.hit_points,
        damage: state.boss.damage,
        mana: 0,
      },
      shield: state.shield,
      poison: 6,
      recharge: state.recharge,
    });
  }
}

fn cast_recharge(state: &State, heap: &mut BinaryHeap<State>) {
  if state.player.mana >= 229 && state.recharge == 0 {
    heap.push(State {
      cost: state.cost + 229,
      player: Character {
        hit_points: state.player.hit_points,
        damage: 0,
        mana: state.player.mana - 229,
      },
      boss: Character {
        hit_points: state.boss.hit_points,
        damage: state.boss.damage,
        mana: 0,
      },
      shield: state.shield,
      poison: state.poison,
      recharge: 5,
    });
  }
}

pub fn find_least_mana_to_win(
  player_hp: i32,
  player_mana: i32,
  boss_hp: i32,
  boss_damage: i32,
  attrition: bool,
) -> i32 {
  let mut heap = BinaryHeap::new();
  let mut visited: HashSet<State> = HashSet::new();
  heap.push(State {
    cost: 0,
    player: Character {
      hit_points: player_hp,
      damage: 0,
      mana: player_mana,
    },
    boss: Character {
      hit_points: boss_hp,
      damage: boss_damage,
      mana: 0,
    },
    shield: 0,
    poison: 0,
    recharge: 0,
  });

  while let Some(mut state) = heap.pop() {
    if visited.contains(&state) {
      continue;
    }
    visited.insert(state);

    // Boss turn does not occur on first loop iteration
    if state.cost != 0 {
      apply_effects(&mut state);

      if state.player.hit_points <= 0 {
        continue;
      } else if state.boss.hit_points <= 0 {
        return state.cost;
      }

      boss_attack(&mut state);
    }

    apply_attrition(&mut state, attrition);
    apply_effects(&mut state);

    if state.player.hit_points <= 0 {
      continue;
    } else if state.boss.hit_points <= 0 {
      return state.cost;
    }

    cast_magic_missile(&state, &mut heap);
    cast_drain(&state, &mut heap);
    cast_shield(&state, &mut heap);
    cast_poison(&state, &mut heap);
    cast_recharge(&state, &mut heap);
  }

  -1
}

#[cfg(test)]
mod tests {
  use crate::day22::find_least_mana_to_win;

  #[test]
  fn test_find_least_mana_to_win() {
    assert_eq!(226, find_least_mana_to_win(10, 250, 13, 8, false));
    assert_eq!(641, find_least_mana_to_win(10, 250, 14, 8, false));
    assert_eq!(953, find_least_mana_to_win(50, 500, 55, 8, false));
    assert_eq!(1289, find_least_mana_to_win(50, 500, 55, 8, true)); // 1020 too low
  }
}
