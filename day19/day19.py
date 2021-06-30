from typing import Optional
from lib.vector import Vector

NEIGHBORS: dict[Vector, str] = {
    Vector(1, 0): "-",
    Vector(-1, 0): "-",
    Vector(0, 1): "|",
    Vector(0, -1): "|",
}


def next_direction(
    lines: list[str], position: Vector, direction: Vector, letters: Optional[list[str]] = None
) -> Optional[Vector]:
    no_turn_character = NEIGHBORS[direction]
    character = lines[position.y][position.x]
    if character in ["-", "|"] or character.isalpha():
        if character.isalpha() and isinstance(letters, list):
            letters.append(character)
        return direction
    elif character == "+":
        potential_directions: list[Vector] = [
            Vector(direction.y, -direction.x),
            Vector(-direction.y, direction.x),
        ]
        for potential_direction in potential_directions:
            potential_position = position + potential_direction
            potential_character: str = lines[potential_position.y][potential_position.x]
            if (
                potential_character in ["|", "-", "+"] or potential_character.isalpha()
            ) and potential_character != no_turn_character:
                return potential_direction
    return None


def find_path_order(lines: list[str]) -> str:
    starting_x: int = lines[0].index("|")
    position = Vector(starting_x, 0)
    direction = Vector(0, 1)
    letters: list[str] = []
    while True:
        new_direction: Optional[Vector] = next_direction(
            lines, position, direction, letters
        )
        if not new_direction:
            break
        direction = new_direction
        position += direction
    return "".join(letters)


def find_path_steps(lines: list[str]) -> int:
    starting_x: int = lines[0].index("|")
    position = Vector(starting_x, 0)
    direction = Vector(0, 1)
    steps = 0
    while True:
        new_direction: Optional[Vector] = next_direction(lines, position, direction)
        if not new_direction:
            break
        direction = new_direction
        position += direction
        steps += 1
    return steps
