from enum import Enum
import re
from typing import Optional

from lib.vector import Vector

DIG_PATTERN: str = r"(\w) (\d+) \(#(\w+)\)"

class DigDirection(Enum):
  U = 1
  R = 2
  D = 3
  L = 4

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
  def __init__(self, direction: DigDirection, steps: int, color: str) -> None:
    self.direction = direction
    self.steps = steps
    self.color = color

def parse_dig_plan(lines: list[str]) -> list[DigInstruction]:
  plan: list[DigInstruction] = []

  for line in lines:
    dig_match: Optional[re.Match] = re.match(DIG_PATTERN, line)
    if not dig_match:
      raise RuntimeError(f"Line does not match pattern: {line}")
    plan.append(DigInstruction(
      DigDirection[dig_match.group(1)],
      int(dig_match.group(2)),
      dig_match.group(3),
    ))

  return plan

def get_segment_positions(dig_plan: list[DigInstruction]) -> set[Vector]:
  segment_positions: set[Vector] = set()
  position: Vector = Vector(0, 0)

  for instruction in dig_plan:
    for i in range(instruction.steps):
      segment_positions.add(position + i * instruction.direction.vector)
    position = position + instruction.steps * instruction.direction.vector

  return segment_positions

def find_lagoon_surface(lines: list[str]) -> int:
  dig_plan: list[DigInstruction] = parse_dig_plan(lines)
  segment_positions: set[Vector] = get_segment_positions(dig_plan)
  surface: int = 0
  stack: list[Vector] = [Vector(1, 1)]
  visited: set[Vector] = set()

  while stack:
    position: Vector = stack.pop()
    if position in visited or position in segment_positions:
      continue
    visited.add(position)

    surface += 1

    for neighbor in [Vector(1, 0), Vector(-1, 0), Vector(0, 1), Vector(0, -1)]:
      stack.append(position + neighbor)

  return surface + len(segment_positions)
