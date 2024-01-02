from enum import IntEnum
import re
from typing import Optional

from lib.vector import Vector

DIG_PATTERN: str = r"(\w) (\d+) \(#(\w+)(\w)\)"

class DigDirection(IntEnum):
  R = 0
  D = 1
  L = 2
  U = 3

  @property
  def vector(self) -> Vector:
    match self:
      case DigDirection.U:
        return Vector(0, -1)
      case DigDirection.R:
        return Vector(1, 0)
      case DigDirection.D:
        return Vector(0, 1)
      case DigDirection.L:
        return Vector(-1, 0)

class DigInstruction:
  def __init__(self, direction: DigDirection, steps: int) -> None:
    self.direction = direction
    self.steps = steps

  def __str__(self) -> str:
    return f"{self.direction} {self.steps}"

  def __repr__(self) -> str:
    return str(self)

  @property
  def vector(self) -> Vector:
    return self.steps * self.direction.vector

def parse_dig_plan(lines: list[str], from_color: bool) -> list[DigInstruction]:
  plan: list[DigInstruction] = []

  for line in lines:
    dig_match: Optional[re.Match] = re.match(DIG_PATTERN, line)
    if not dig_match:
      raise RuntimeError(f"Line does not match pattern: {line}")
    if from_color:
      plan.append(DigInstruction(
        DigDirection(int(dig_match.group(4))),
        int(dig_match.group(3), 16),
      ))
    else:
      plan.append(DigInstruction(
        DigDirection[dig_match.group(1)],
        int(dig_match.group(2)),
      ))

  return plan

def get_dig_points(dig_plan: list[DigInstruction]) -> list[Vector]:
  position: Vector = Vector(0, 0)
  points: list[Vector] = [position]

  for instruction in dig_plan:
    next_position: Vector = position + instruction.vector
    points.append(next_position)
    position = next_position

  return points

def find_lagoon_surface(lines: list[str], from_color: bool) -> int:
  dig_plan: list[DigInstruction] = parse_dig_plan(lines, from_color)
  dig_points: list[Vector] = get_dig_points(dig_plan)
  double_area: int = 0

  for i in range(len(dig_points) - 1):
    p1: Vector = dig_points[i]
    p2: Vector = dig_points[i + 1]
    double_area += p1.x * p2.y - p1.y * p2.x + abs(p2 - p1)

  return abs(double_area // 2) + 1
