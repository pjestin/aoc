class Node:
    def __init__(self, name: str, weight: int, children: list[str]):
        self.name = name
        self.weight = weight
        self.children = children


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


def __find_deepest_subtree(nodes: dict[str, Node]):
    max_depth = 0
    max_depth_program: str = None
    for program, node in nodes.items():
        depth = __depth(node, nodes)
        if depth > max_depth:
            max_depth = depth
            max_depth_program = program
    return max_depth_program


def find_bottom_program(lines: list[str]) -> str:
    nodes: dict[str, Node] = __parse_nodes(lines)
    return __find_deepest_subtree(nodes)
