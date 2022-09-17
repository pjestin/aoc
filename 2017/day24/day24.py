from __future__ import annotations


class Component:
    def __init__(self, left_port: int, right_port: int) -> None:
        self.left_port = left_port
        self.right_port = right_port

    @classmethod
    def parse(cls, line: str) -> Component:
        split_line = line.split("/")
        return cls(int(split_line[0]), int(split_line[1]))

    def __eq__(self, o: object) -> bool:
        return (
            isinstance(o, Component)
            and self.left_port == o.left_port
            and self.right_port == o.right_port
        )

    def __ne__(self, o: object) -> bool:
        return not self == o

    def __hash__(self) -> int:
        return hash(self.left_port * 127 + self.right_port)

    def __str__(self) -> str:
        return "{}/{}".format(self.left_port, self.right_port)

    def __repr__(self) -> str:
        return str(self)


class State:
    def __init__(self, port: int, used_components: set[Component]) -> None:
        self.port = port
        self.used_components = used_components


class Bridge:
    def __init__(self, strength: int, length: int) -> None:
        self.strength = strength
        self.length = length


def __build_bridges_strength_length(components: list[Component]) -> list[Bridge]:
    bridges: list[Bridge] = []
    state_queue: list[State] = [State(0, set())]

    while len(state_queue) > 0:
        state: State = state_queue.pop(0)
        bridge_length = len(state.used_components)
        bridge_strength = sum(
            component.left_port + component.right_port
            for component in state.used_components
        )
        bridges.append(Bridge(bridge_strength, bridge_length))
        for potential_component in components:
            if potential_component in state.used_components:
                continue
            if (
                potential_component.left_port == state.port
                or potential_component.right_port == state.port
            ):
                used_components = set(state.used_components)
                used_components.add(potential_component)
                state_queue.append(
                    State(
                        potential_component.right_port
                        if potential_component.left_port == state.port
                        else potential_component.left_port,
                        used_components,
                    )
                )

    return bridges


def find_strongest_bridge(lines: list[str]) -> int:
    components: list[Component] = [Component.parse(line) for line in lines]
    bridges: list[Bridge] = __build_bridges_strength_length(components)
    max_bridge_strength = 0

    for bridge in bridges:
        if bridge.strength > max_bridge_strength:
            max_bridge_strength = bridge.strength

    return max_bridge_strength


def find_longest_bridge_strength(lines: list[str]) -> int:
    components: list[Component] = [Component.parse(line) for line in lines]
    bridges: list[Bridge] = __build_bridges_strength_length(components)
    max_bridge_length = 0
    max_bridge_strength = 0

    for bridge in bridges:
        if bridge.length > max_bridge_length:
            max_bridge_length = bridge.length
            max_bridge_strength = bridge.strength
        elif bridge.length == max_bridge_length:
            if bridge.strength > max_bridge_strength:
                max_bridge_strength = bridge.strength

    return max_bridge_strength
