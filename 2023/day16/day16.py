from lib.vector import Vector

def parse_mirrors(lines: list[str]) -> list[list[str]]:
  return list(map(list, lines))

def energize(mirrors: list[list[str]], start_position: Vector, start_direction: Vector) -> int:
  visited: set[str] = set()
  visited_positions: set[Vector] = set()
  stack: list[tuple[Vector, Vector]] = [(start_position, start_direction)]

  while stack:
    position, direction = stack.pop()
    hash: str = f"{position};{direction}"
    if hash in visited or position.x < 0 or position.y < 0 \
        or position.x >= len(mirrors[0]) or position.y >= len(mirrors):
      continue
    visited.add(hash)
    visited_positions.add(position)

    mirror: str = mirrors[position.y][position.x]
    if (mirror == "|" and direction.y == 0) or (mirror == "-" and direction.x == 0):
      for new_direction in [Vector(-direction.y, direction.x), Vector(direction.y, -direction.x)]:
        stack.append((position + new_direction, new_direction))
    elif mirror == "\\":
      direction = Vector(direction.y, direction.x)
      stack.append((position + direction, direction))
    elif mirror == "/":
      direction = Vector(-direction.y, -direction.x)
      stack.append((position + direction, direction))
    else:
      stack.append((position + direction, direction))

  return len(visited_positions)

def count_energized(lines: list[str]) -> int:
  mirrors: list[list[str]] = parse_mirrors(lines)
  return energize(mirrors, Vector(0, 0), Vector(1, 0))

def count_max_energized(lines: list[str]) -> int:
  mirrors: list[list[str]] = parse_mirrors(lines)
  max_energized: int = 0

  for row in range(len(mirrors)):
    max_energized = max(max_energized, energize(mirrors, Vector(0, row), Vector(1, 0)))
    max_energized = max(max_energized, energize(mirrors, Vector(len(mirrors[0]) - 1, row), Vector(-1, 0)))

  for col in range(len(mirrors[0])):
    max_energized = max(max_energized, energize(mirrors, Vector(col, 0), Vector(0, 1)))
    max_energized = max(max_energized, energize(mirrors, Vector(col, len(mirrors) - 1), Vector(0, -1)))

  return max_energized
