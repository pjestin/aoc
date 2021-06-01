class Node:
    def __init__(self, name: str, weight: int, children: list[str]):
        self.name = name
        self.weight = weight
        self.children = children
        self.stack_weight: int = None


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


def __find_deepest_subtree(nodes: dict[str, Node]) -> str:
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


def __assign_stack_weight(nodes: dict[str, Node], root: Node) -> None:
    stack_weight = root.weight
    for child in root.children:
        __assign_stack_weight(nodes, nodes[child])
        stack_weight += nodes[child].stack_weight
    root.stack_weight = stack_weight


def __find_balance(nodes: dict[str, Node], root: Node) -> int:
    weight_counts: dict[int, tuple[int, str]] = {}
    for child in root.children:
        child_node = nodes[child]
        if child_node.stack_weight not in weight_counts:
            weight_counts[child_node.stack_weight] = (0, child)
        count, child = weight_counts[child_node.stack_weight]
        weight_counts[child_node.stack_weight] = (count + 1, child)

    if len(weight_counts) <= 1:
        for child in root.children:
            balance = __find_balance(nodes, nodes[child])
            if balance:
                return balance
        return None

    assert len(weight_counts) == 2

    lone_weight_child = None
    lone_count_weight = 0
    max_count_weight = 0
    for child_weight, count_and_child in weight_counts.items():
        count, child = count_and_child
        if count == 1:
            lone_weight_child = child
            lone_count_weight = child_weight
        else:
            max_count_weight = child_weight

    correction = max_count_weight - lone_count_weight
    return nodes[lone_weight_child].weight + correction


def find_correct_weight(lines: list[str]) -> int:
    nodes: dict[str, Node] = __parse_nodes(lines)
    root: Node = nodes[__find_deepest_subtree(nodes)]
    __assign_stack_weight(nodes, root)
    return __find_balance(nodes, root)
