from lib.vector import Vector


DIRECTIONS = {
    "n": Vector(0, 1),
    "ne": Vector(1, 0),
    "se": Vector(1, -1),
    "s": Vector(0, -1),
    "sw": Vector(-1, 0),
    "nw": Vector(-1, 1),
}


def __distance_to_centre(position: Vector) -> int:
    if position.x * position.y < 0:
        return max(abs(position.x), abs(position.y))
    else:
        return abs(position)


def hex_distance(line: str) -> int:
    path: list[str] = line.split(",")
    position = Vector(0, 0)
    for step in path:
        position += DIRECTIONS[step]
    return __distance_to_centre(position)


def max_hex_distance(line: str) -> int:
    path: list[str] = line.split(",")
    position = Vector(0, 0)
    max_distance = 0
    for step in path:
        position += DIRECTIONS[step]
        distance = __distance_to_centre(position)
        if distance > max_distance:
            max_distance = distance
    return max_distance
