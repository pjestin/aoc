import re
from typing import Optional

GAME_PATTERN: str = "Game (\d+)"
CUBE_PATTERN: str = "(\d+) (\w+)"
MAX_CUBES: dict[str, int] = {
  "red": 12,
  "green": 13,
  "blue": 14,
}

class Game:
  def __init__(self, id: int):
    self.id = id
    self.cube_sets = []
  
  def is_possible(self) -> bool:
    for cube_set in self.cube_sets:
      for color, nb_cubes in cube_set.items():
        if nb_cubes > MAX_CUBES[color]:
          return False
    return True

  def power(self) -> int:
    cubes: dict[str, int] = {}
    for cube_set in self.cube_sets:
      for color, nb_cubes in cube_set.items():
        cubes[color] = max(cubes.get(color, 0), nb_cubes)
    
    result: int = 1
    for color, nb_cubes in cubes.items():
      result *= nb_cubes
    return result

def parse_game_line(line: str) -> Game:
  split_line: list[str] = line.split(": ")
  game_match: Optional[re.Match] = re.match(GAME_PATTERN, split_line[0])
  game_id: int = int(game_match.group(1))
  game: Game = Game(game_id)

  for cube_set in split_line[1].split("; "):
    cube_set_object: dict[str, int] = {}
    for cube_info in cube_set.split(", "):
      cube_match: Optional[re.Match] = re.match(CUBE_PATTERN, cube_info)
      nb_cubes: int = int(cube_match.group(1))
      color: str = cube_match.group(2)
      cube_set_object[color] = nb_cubes
    game.cube_sets.append(cube_set_object)
  
  return game

def sum_possible_ids(lines: list[str]) -> int:
  result: int = 0

  for line in lines:
    game: Game = parse_game_line(line)
    if game.is_possible():
      result += game.id
  
  return result

def sum_game_powers(lines: list[str]) -> int:
  result: int = 0

  for line in lines:
    game: Game = parse_game_line(line)
    result += game.power()
  
  return result
