from lib.vector import Vector

def parse_plots(lines: list[str]) -> tuple[set[Vector], Vector, Vector]:
  rocks: set[Vector] = set()
  start: Vector = Vector(0, 0)
  plot_size: Vector = Vector(len(lines[0]), len(lines))

  for row in range(len(lines)):
    for col in range(len(lines[0])):
      match lines[row][col]:
        case "S":
          start = Vector(col, row)
        case "#":
          rocks.add(Vector(col, row))

  return rocks, start, plot_size

def count_garden_plots(lines: list[str], target: int) -> int:
  rocks, start, plot_size = parse_plots(lines)
  queue: list[tuple[Vector, int]] = [(start, 0)]
  reachable_positions: set[Vector] = set()
  visited: set[Vector] = set()

  while queue:
    position, steps = queue.pop(0)
    canonic_position: Vector = Vector(position.x % plot_size.x, position.y % plot_size.y)

    if canonic_position in rocks or position in visited:
      continue
    elif steps % 2 == target % 2:
      reachable_positions.add(position)

    if steps == target:
      continue

    visited.add(position)

    for neighbor in [Vector(1, 0), Vector(0, 1), Vector(-1, 0), Vector(0, -1)]:
      neighbor_position: Vector = position + neighbor
      queue.append((neighbor_position, steps + 1))

  return len(reachable_positions)
