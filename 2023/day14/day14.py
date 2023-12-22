import functools

from lib.vector import Vector

TOTAL_CYCLES: int = 1_000_000_000

def parse_rocks(lines: list[str]) -> (set[Vector], set[Vector]):
  rounded_rocks: set[Vector] = set()
  cube_shaped_rocks: set [Vector] = set()

  for row in range(len(lines)):
    for col in range(len(lines[0])):
      match lines[row][col]:
        case "O":
          rounded_rocks.add(Vector(col, row))
        case "#":
          cube_shaped_rocks.add(Vector(col, row))

  return rounded_rocks, cube_shaped_rocks

def slide(rounded_rocks: set[Vector], cube_shaped_rocks: set[Vector], row_size: int, col_size: int, direction: Vector) -> None:
  row_range: range[int] = range(row_size) if direction.y == -1 else range(row_size - 1, -1, -1)
  col_range: range[int] = range(col_size) if direction.x == -1 else range(col_size - 1, -1, -1)

  for row in row_range:
    for col in col_range:
      position: Vector = Vector(col, row)
      if position in rounded_rocks:
        last_potential_position: Vector = position
        index: int = 1
        while col + direction.x * index >= 0 and col + direction.x * index < col_size \
            and row + direction.y * index >= 0 and row + direction.y * index < row_size:
          potential_position: Vector = Vector(col + direction.x * index, row + direction.y * index)
          if potential_position not in rounded_rocks and potential_position not in cube_shaped_rocks:
            last_potential_position = potential_position
            index += 1
          else:
            break
        if last_potential_position != position:
          rounded_rocks.remove(position)
          rounded_rocks.add(last_potential_position)

def total_load(lines: list[str]) -> int:
  row_size: int = len(lines)
  col_size: int = len(lines[0])
  rounded_rocks, cube_shaped_rocks = parse_rocks(lines)

  slide(rounded_rocks, cube_shaped_rocks, row_size, col_size, Vector(0, -1))

  return sum(map(lambda rock: row_size - rock.y, rounded_rocks))

def get_rounded_rocks_hash(rocks: set[Vector]) -> str:
  position_strs: list[str] = sorted(map(str, rocks))
  return functools.reduce(lambda previous, position_str: f"{previous};{position_str}", position_strs, "")

def total_load_after_cycles(lines: list[str]) -> int:
  row_size: int = len(lines)
  col_size: int = len(lines[0])
  rounded_rocks, cube_shaped_rocks = parse_rocks(lines)
  cache: dict[str, int] = {}
  index: int = 0

  while index < TOTAL_CYCLES:
    for direction in [Vector(0, -1), Vector(-1, 0), Vector(0, 1), Vector(1, 0)]:
      slide(rounded_rocks, cube_shaped_rocks, row_size, col_size, direction)

    rounded_rocks_hash: str = get_rounded_rocks_hash(rounded_rocks)
    if rounded_rocks_hash in cache:
      cycle_length: int = index - cache[rounded_rocks_hash]
      nb_cycles: int = (TOTAL_CYCLES - index) // cycle_length
      index += nb_cycles * cycle_length

    cache[rounded_rocks_hash] = index
    index += 1
  
  return sum(map(lambda rock: row_size - rock.y, rounded_rocks))
