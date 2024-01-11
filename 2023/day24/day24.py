from __future__ import annotations
import re
from typing import Optional

from lib.vector import Vector

HAILSTONE_PATTERN: str = r"(\d+),\s*(\d+),\s*(\d+)\s*@\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)"


def det(u: Vector, v: Vector) -> int:
  return u.x * v.y - u.y * v.x

def in_test_area(intersection: tuple[float, float], test_area: tuple[int, int]) -> bool:
  return test_area[0] <= intersection[0] <= test_area[1] and test_area[0] <= intersection[1] <= test_area[1]

class Hailstone:
  def __init__(self, position: Vector, direction: Vector) -> None:
    self.position = position
    self.direction = direction

  def __str__(self) -> str:
    return f"{self.position}; {self.direction}"

  def __repr__(self) -> str:
    return str(self)

  def intersects(self, o: Hailstone, test_area: tuple[int, int]) -> bool:
    this_direction_without_z: Vector = Vector(self.direction.x, self.direction.y)
    other_direction_without_z: Vector = Vector(o.direction.x, o.direction.y)
    position_vector_without_z: Vector = Vector(o.position.x - self.position.x, o.position.y - self.position.y)
    det1: int = det(position_vector_without_z, this_direction_without_z)
    det2: int = det(position_vector_without_z, other_direction_without_z)
    det3: int = det(this_direction_without_z, other_direction_without_z)

    if det3 == 0 \
        or (det1 > 0) != (det2 > 0) \
        or (det1 > 0) != (det3 > 0):
      return False

    parameter: float = det2 / det3
    intersection: tuple[float, float] = (
      self.position.x + parameter * self.direction.x,
      self.position.y + parameter * self.direction.y,
    )

    return in_test_area(intersection, test_area)

def parse_hailstones(lines: list[str]) -> list[Hailstone]:
  hailstones: list[Hailstone] = []

  for line in lines:
    match: Optional[re.Match] = re.match(HAILSTONE_PATTERN, line)
    position: Vector = Vector(int(match.group(1)), int(match.group(2)), int(match.group(3)))
    direction: Vector = Vector(int(match.group(4)), int(match.group(5)), int(match.group(6)))
    hailstones.append(Hailstone(position, direction))

  return hailstones

def count_intersection(lines: list[str], test_area: tuple[int, int]) -> int:
  hailstones: list[Hailstone] = parse_hailstones(lines)
  nb_intersections: int = 0

  for i in range(len(hailstones)):
    h1: Hailstone = hailstones[i]
    for j in range(i + 1, len(hailstones)):
      h2: Hailstone = hailstones[j]
      if h1.intersects(h2, test_area):
        nb_intersections += 1

  return nb_intersections
