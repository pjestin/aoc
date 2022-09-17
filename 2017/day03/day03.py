from typing import Dict, Set

from lib.vector import Vector


def find_spiral_pattern_steps(input: int) -> int:
    visited: Set[Vector] = set()
    position = Vector(0, 0)
    direction = Vector(0, 1)
    for _ in range(1, input):
        visited.add(position)
        turn_direction = Vector(direction.y, -direction.x)
        if position + turn_direction not in visited:
            position += turn_direction
            direction = turn_direction
        else:
            position += direction
    return abs(position)


NEIGHBORS = [
    Vector(1, 0),
    Vector(1, 1),
    Vector(1, -1),
    Vector(0, 1),
    Vector(0, -1),
    Vector(-1, -1),
    Vector(-1, 0),
    Vector(-1, 1),
]


def find_stress_test_large_value(input: int) -> int:
    values: Dict[Vector, int] = {}
    position = Vector(0, 0)
    direction = Vector(0, 1)
    values[position] = 1
    while values[position] <= input:
        turn_direction = Vector(direction.y, -direction.x)
        if position + turn_direction not in values:
            position += turn_direction
            direction = turn_direction
        else:
            position += direction
        new_value = 0
        for neighbor_direction in NEIGHBORS:
            if position + neighbor_direction in values:
                new_value += values[position + neighbor_direction]
        values[position] = new_value
    return values[position]
