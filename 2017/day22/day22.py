from enum import Enum
from lib.vector import Vector


class NodeState(Enum):
    CLEAN = 0
    WEAKENED = 1
    INFECTED = 2
    FLAGGED = 3


def parse_infections(lines: list[str]) -> dict[Vector, NodeState]:
    map_size = len(lines)
    infections: dict[Vector, NodeState] = {}

    for y in range(map_size):
        for x in range(map_size):
            position = Vector(x - map_size // 2, y - map_size // 2)
            if lines[y][x] == "#":
                infections[position] = NodeState.INFECTED

    return infections


def count_burst_infections(lines: list[str], nb_bursts: int) -> int:
    infections: dict[Vector, NodeState] = parse_infections(lines)
    current = Vector(0, 0)
    direction = Vector(0, -1)
    burst_infections = 0

    for _ in range(nb_bursts):
        # Change direction
        if current in infections:
            direction = Vector(-direction.y, direction.x)
        else:
            direction = Vector(direction.y, -direction.x)

        # Clean/infect
        if current in infections:
            del infections[current]
        else:
            infections[current] = NodeState.INFECTED
            burst_infections += 1

        # Move
        current += direction

    return burst_infections


def count_burst_infections_multistate(lines: list[str], nb_bursts: int) -> int:
    infections: dict[Vector, NodeState] = parse_infections(lines)
    current = Vector(0, 0)
    direction = Vector(0, -1)
    burst_infections = 0

    for _ in range(nb_bursts):
        if current not in infections:
            infections[current] = NodeState.CLEAN

        current_state: NodeState = infections[current]

        # Change direction
        direction = {
            NodeState.CLEAN: Vector(direction.y, -direction.x),
            NodeState.WEAKENED: direction,
            NodeState.INFECTED: Vector(-direction.y, direction.x),
            NodeState.FLAGGED: -direction,
        }[current_state]

        # Change state
        infections[current] = {
            NodeState.CLEAN: NodeState.WEAKENED,
            NodeState.WEAKENED: NodeState.INFECTED,
            NodeState.INFECTED: NodeState.FLAGGED,
            NodeState.FLAGGED: NodeState.CLEAN,
        }[current_state]

        # Account for infections
        if infections[current] == NodeState.INFECTED:
            burst_infections += 1

        # Move
        current += direction

    return burst_infections
