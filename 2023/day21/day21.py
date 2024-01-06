import numpy as np

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

def display(rocks: set[Vector], reachable_positions: set[Vector]) -> str:
  min_position: Vector = Vector(0, 0)
  max_position: Vector = Vector(0, 0)

  for position in reachable_positions:
    min_position.x = min(min_position.x, position.x)
    min_position.y = min(min_position.y, position.y)
    max_position.x = max(max_position.x, position.x)
    max_position.y = max(max_position.y, position.y)

  result: list[list[str]] = [["." for _ in range(max_position.x - min_position.x + 1)] for _ in range(max_position.y - min_position.y + 1)]

  for position in reachable_positions:
    result[position.y - min_position.y][position.x - min_position.x] = "O"

  for rock in rocks:
    result[rock.y - min_position.y][rock.x - min_position.x] = "#"

  return "\n".join(map(lambda row: "".join(row), result))

def count_reachable_positions(rocks: set[Vector], start: Vector, plot_size: Vector, target: int) -> int:
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

def count_garden_plots(lines: list[str], target: int) -> int:
  rocks, start, plot_size = parse_plots(lines)
  return count_reachable_positions(rocks, start, plot_size, target)

def extrapolate_large_garden_plots(lines: list[str], target: int) -> int:
  rocks, start, plot_size = parse_plots(lines)

  offset: int = target % plot_size.x
  steps: list[int] = [offset + (plot_size.x * i) for i in range(3)]
  reachables: list[int] = [count_reachable_positions(rocks, start, plot_size, step) for step in steps]

  model = np.poly1d(np.polyfit(steps, reachables, 2))

  return round(model(target))
