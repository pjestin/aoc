class GraphNode:
    def __init__(self, node_id: int):
        self.node_id = node_id
        self.neighbors: set[int] = set()


class Graph:
    def __init__(self):
        self.nodes: dict[int, GraphNode] = {}

    def add(self, node: GraphNode):
        self.nodes[node.node_id] = node

    def get(self, node_id: int):
        return self.nodes[node_id]

    def all_nodes(self) -> list[GraphNode]:
        return list(self.nodes.values())

    @classmethod
    def parse(cls, lines: list[str]):
        graph = Graph()
        for line in lines:
            split_line = line.split(" <-> ")
            node_id = int(split_line[0])
            neighbors: list[int] = list(map(int, split_line[1].split(", ")))
            node = GraphNode(node_id)
            for neighbor in neighbors:
                node.neighbors.add(neighbor)
            graph.add(node)
        return graph


def __count_programs_in_group(graph: Graph, root: GraphNode, visited: set[int]) -> int:
    queue: list[GraphNode] = [root]
    group_count = 0
    while len(queue) > 0:
        node: GraphNode = queue.pop(0)
        if node.node_id in visited:
            continue
        group_count += 1
        visited.add(node.node_id)
        for neighbor in node.neighbors:
            queue.append(graph.get(neighbor))
    return group_count


def count_programs(lines: list[str]) -> int:
    graph: Graph = Graph.parse(lines)
    visited: set[int] = set()
    return __count_programs_in_group(graph, graph.get(0), visited)


def count_groups(lines: list[str]) -> int:
    graph: Graph = Graph.parse(lines)
    visited: set[int] = set()
    group_count = 0
    for node in graph.all_nodes():
        programs_in_group: int = __count_programs_in_group(graph, node, visited)
        if programs_in_group > 0:
            group_count += 1
    return group_count
