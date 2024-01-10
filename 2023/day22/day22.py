
from __future__ import annotations
import re
from typing import Optional

from lib.vector import Vector

BRICK_PATTERN: str = r"(\d+),(\d+),(\d+)~(\d+),(\d+),(\d+)"

class Brick:
  def __init__(self, start: Vector, end: Vector) -> None:
    self.start = start
    self.end = end
    self.supports = set()
    self.supported_by = set()

  def __str__(self) -> str:
    return f"{self.start}~{self.end}"

  def __repr__(self) -> str:
    return str(self)

  def __eq__(self, o: Brick) -> bool:
    return self.start == o.start and self.end == o.end

  def __hash__(self) -> int:
    return hash(str(self))

def parse_bricks(lines: list[str]) -> list[Brick]:
  bricks: list[Brick] = []

  for line in lines:
    brick_match: Optional[re.Match] = re.match(BRICK_PATTERN, line)
    x1: int = int(brick_match.group(1))
    y1: int = int(brick_match.group(2))
    z1: int = int(brick_match.group(3))
    x2: int = int(brick_match.group(4))
    y2: int = int(brick_match.group(5))
    z2: int = int(brick_match.group(6))
    start: Vector = Vector(min(x1, x2), min(y1, y2), min(z1, z2))
    end: Vector = Vector(max(x1, x2), max(y1, y2), max(z1, z2))
    bricks.append(Brick(start, end))

  return bricks

def get_max_position(bricks: list[Brick]) -> Vector:
  max_position: Vector = Vector(0, 0, 0)

  for brick in bricks:
    max_position.x = max(max_position.x, brick.start.x, brick.end.x)
    max_position.y = max(max_position.y, brick.start.y, brick.end.y)
    max_position.z = max(max_position.z, brick.start.z, brick.end.z)

  return max_position

def transform_bricks(bricks: list[Brick], max_position: Vector) -> None:
  below_bricks: list[list[Optional[Brick]]] = [[None for _ in range(max_position.x + 1)] for _ in range(max_position.y + 1)]

  for z in range(max_position.z + 1):
    for brick in bricks:
      if brick.start.z != z:
        continue

      supporting_bricks: set[Brick] = set()
      max_below_z: int = 0
      for x in range(brick.start.x, brick.end.x + 1):
        for y in range(brick.start.y, brick.end.y + 1):
          if below_bricks[y][x] is not None:
            if below_bricks[y][x].end.z > max_below_z:
              max_below_z = below_bricks[y][x].end.z
              supporting_bricks = set([below_bricks[y][x]])
            elif below_bricks[y][x].end.z == max_below_z:
              supporting_bricks.add(below_bricks[y][x])

      if max_below_z + 1 < z:
        brick.start.z -= (z - max_below_z - 1)
        brick.end.z -= (z - max_below_z - 1)

      brick.supported_by = supporting_bricks
      for supporting_brick in supporting_bricks:
        supporting_brick.supports.add(brick)

      for x in range(brick.start.x, brick.end.x + 1):
        for y in range(brick.start.y, brick.end.y + 1):
          below_bricks[y][x] = brick

def can_be_disintegrated(brick: Brick) -> bool:
  for supported_brick in brick.supports:
    if len(supported_brick.supported_by) == 1:
      return False
  return True

def count_disintegratable_bricks(lines: list[str]) -> int:
  bricks: list[Brick] = parse_bricks(lines)

  max_position: Vector = get_max_position(bricks)
  transform_bricks(bricks, max_position)

  return sum(1 for _ in filter(can_be_disintegrated, bricks))

def sum_other_bricks_fall(lines: list[str]) -> int:
  bricks: list[Brick] = parse_bricks(lines)

  max_position: Vector = get_max_position(bricks)
  transform_bricks(bricks, max_position)

  result: int = 0
  for brick_to_disintegrate in bricks:
    stack: list[Brick] = [brick_to_disintegrate]
    fallen_bricks: set[Brick] = set()

    while stack:
      brick: Brick = stack.pop()

      if brick in fallen_bricks:
        continue

      fallen_bricks.add(brick)

      for supported_brick in brick.supports:
        if len(supported_brick.supported_by.difference(fallen_bricks)) == 0:
          stack.append(supported_brick)

    result += len(fallen_bricks) - 1

  return result
