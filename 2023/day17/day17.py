from __future__ import annotations
import heapq

from lib.vector import Vector

NEIGHBORS: list[Vector] = [
  Vector(1, 0),
  Vector(0, 1),
  Vector(-1, 0),
  Vector(0, -1),
]

def parse_grid(lines: list[str]) -> list[list[int]]:
  return list(map(lambda line: list(map(int, line)), lines))

class State:
  def __init__(self, position: Vector, direction: Vector, heat_loss: int, straight: int) -> None:
    self.position = position
    self.direction = direction
    self.heat_loss = heat_loss
    self.straight = straight

  def __lt__(self, other: State) -> bool:
    return self.heat_loss < other.heat_loss

  def __le__(self, other: State) -> bool:
    return self.heat_loss <= other.heat_loss

  def __eq__(self, other: State) -> bool:
    return self.position == other.position and self.direction == other.direction and self.straight == other.straight

  def __hash__(self) -> int:
    return hash(f"{self.position};{self.direction};{self.straight}")

def find_min_heat_loss(lines: list[str], ultra_crucible: bool) -> int:
  grid: list[list[int]] = parse_grid(lines)
  heap: list[State] = [State(Vector(0, 0), Vector(0, 0), 0, 0)]
  target: Vector = Vector(len(grid[0]) - 1, len(grid) - 1)
  visited: set[State] = set()

  while heap:
    current: State = heapq.heappop(heap)
    if current.position == target and (not ultra_crucible or current.straight >= 4):
      return current.heat_loss
    elif current in visited:
      continue

    visited.add(current)

    for new_direction in NEIGHBORS:
      neighbor_position: Vector = current.position + new_direction
      if neighbor_position.x < 0 or neighbor_position.y < 0 \
          or neighbor_position.x >= len(grid[0]) or neighbor_position.y >= len(grid):
        continue

      if new_direction == -current.direction:
        continue

      next_straight: int = current.straight + 1 if (new_direction == current.direction or abs(current.direction) == 0) else 1
      if not ultra_crucible and next_straight >= 4:
        continue
      if ultra_crucible and (
          (current.straight < 4 and abs(current.direction) > 0 and new_direction != current.direction) or \
          (next_straight > 10)
        ):
        continue

      next_heat_loss: int = current.heat_loss + grid[neighbor_position.y][neighbor_position.x]
      heapq.heappush(heap, State(neighbor_position, new_direction, next_heat_loss, next_straight))

  return -1
