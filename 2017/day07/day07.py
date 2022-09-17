from typing import Optional


class Node:
    def __init__(self, name: str, weight: int, children: list[str]):
        self.name = name
        self.weight = weight
        self.children = children
        self.stack_weight: int = 0


def __parse_nodes(lines: list[str]) -> dict[str, Node]:
    nodes: dict[str, Node] = {}
    for program_string in lines:
        program_split_string = program_string.split(")")
        program_first_part = program_split_string[0].split(" (")
        name = program_first_part[0]
        weight = int(program_first_part[1])
        children = (
            program_split_string[1][4:].split(", ") if program_split_string[1] else []
        )
        nodes[name] = Node(name, weight, children)
    return nodes


def __depth(node: Node, nodes: dict[str, Node]) -> int:
    if not node.children:
        return 0
    return max(__depth(nodes[child], nodes) for child in node.children) + 1


def __find_deepest_subtree(nodes: dict[str, Node]) -> Optional[str]:
    max_depth = 0
    max_depth_program: Optional[str] = None
    for program, node in nodes.items():
        depth = __depth(node, nodes)
        if depth > max_depth:
            max_depth = depth
            max_depth_program = program
    return max_depth_program


def find_bottom_program(lines: list[str]) -> Optional[str]:
    nodes: dict[str, Node] = __parse_nodes(lines)
    return __find_deepest_subtree(nodes)


def __assign_stack_weight(nodes: dict[str, Node], root: Node) -> None:
    stack_weight = root.weight
    for child in root.children:
        __assign_stack_weight(nodes, nodes[child])
        stack_weight += nodes[child].stack_weight
    root.stack_weight = stack_weight


def __find_balance(nodes: dict[str, Node], root: Node) -> Optional[int]:
    assert len(root.children) != 1
    if not root.children or len(root.children) == 2:
        return None

    counts: dict[int, tuple[int, Optional[Node]]] = {}
    for child in root.children:
        child_node = nodes[child]
        if child_node.stack_weight not in counts:
            counts[child_node.stack_weight] = (0, None)
        counts[child_node.stack_weight] = (
            counts[child_node.stack_weight][0] + 1,
            child_node,
        )

    if len(counts) == 1:
        return None

    assert len(counts) == 2

    lone_child_node: Optional[Node] = None
    for stack_weight, count_pair in counts.items():
        if count_pair[0] == 1:
            lone_child_node = count_pair[1]
        else:
            balance_stack_weight = stack_weight
    if lone_child_node:
        child_balance = __find_balance(nodes, lone_child_node)
        if child_balance:
            return child_balance
        else:
            return (
                lone_child_node.weight
                + balance_stack_weight
                - lone_child_node.stack_weight
            )
    else:
        raise ValueError("Lone child node not found")


def find_correct_weight(lines: list[str]) -> Optional[int]:
    nodes: dict[str, Node] = __parse_nodes(lines)
    deepest_subtree: Optional[str] = __find_deepest_subtree(nodes)
    if not deepest_subtree:
        raise ValueError("Deepest subtree not found")
    else:
        root: Node = nodes[deepest_subtree]
        __assign_stack_weight(nodes, root)
        return __find_balance(nodes, root)
