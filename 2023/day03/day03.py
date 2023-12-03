from lib.vector import Vector

NEIGHBORS: list[Vector] = [
  Vector(-1, 0),
  Vector(-1, -1),
  Vector(0, -1),
  Vector(1, -1),
  Vector(1, 0),
  Vector(1, 1),
  Vector(0, 1),
  Vector(-1, 1),
]

def get_number_positions(lines: list[str], position: Vector, visited: set[Vector]) -> (Vector, Vector):
  line: str = lines[position.y]
  start: int = position.x
  end: int = position.x

  while start >= 0 and line[start].isdigit():
    start -= 1
  start += 1

  while end < len(line) and line[end].isdigit():
    end += 1
  
  for x in range(start, end):
    visited.add(Vector(x, position.y))

  return (Vector(start, position.y), Vector(end, position.y))

def is_part_number(lines: list[str], number_positions: (Vector, Vector)) -> bool:
  row: int = number_positions[0].y

  for col in range(number_positions[0].x, number_positions[1].x):
    current: Vector = Vector(col, row)
    for neighbor in NEIGHBORS:
      neighbor_position: Vector = current + neighbor
      if not (neighbor_position.x >= 0 and neighbor_position.x < len(lines[0]) \
          and neighbor_position.y >= 0 and neighbor_position.y < len(lines)):
        continue

      c: str = lines[neighbor_position.y][neighbor_position.x]
      if not c.isdigit() and c != ".":
        return True

  return False

def get_number(lines: list[str], number_positions: (Vector, Vector)) -> int:
  return int(lines[number_positions[0].y][number_positions[0].x : number_positions[1].x])

def sum_part_numbers(lines: list[str]) -> int:
  queue: list[Vector] = [Vector(0, 0)]
  visited: set[Vector] = set()
  result: int = 0

  while len(queue) > 0:
    current: Vector = queue.pop(0)
    if current in visited:
      continue
    visited.add(current)

    c: str = lines[current.y][current.x]
    if c.isdigit():
      number_positions: (Vector, Vector) = get_number_positions(lines, current, visited)
      if is_part_number(lines, number_positions):
        result += get_number(lines, number_positions)

    for neighbor in NEIGHBORS:
      neighbor_position: Vector = current + neighbor
      if neighbor_position.x >= 0 and neighbor_position.x < len(lines[0]) \
          and neighbor_position.y >= 0 and neighbor_position.y < len(lines):
        queue.append(neighbor_position)

  return result
