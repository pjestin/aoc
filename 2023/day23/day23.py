from lib.vector import Vector

def parse_forest_and_slopes(lines: list[str]) -> tuple[set[Vector], set[Vector], set[Vector]]:
  forest: set[Vector] = set()
  down_slopes: set[Vector] = set()
  right_slopes: set[Vector] = set()

  for y in range(len(lines)):
    for x in range(len(lines[0])):
      match lines[y][x]:
        case "#":
          forest.add(Vector(x, y))
        case "v":
          down_slopes.add(Vector(x, y))
        case ">":
          right_slopes.add(Vector(x, y))

  return forest, down_slopes, right_slopes

def find_longest_path(lines: list[str]) -> int:
  forest, down_slopes, right_slopes = parse_forest_and_slopes(lines)
  start: Vector = Vector(1, 0)
  target: Vector = Vector(len(lines[0]) - 2, len(lines) - 1)
  stack: list[tuple[Vector, int, set[Vector]]] = [(start, 0, set())]
  max_steps: int = 0

  while stack:
    position, steps, visited = stack.pop()

    if position == target:
      max_steps = max(max_steps, steps)
      continue

    visited.add(position)

    next_positions: list[Vector] = []
    for neighbor in [Vector(1, 0), Vector(0, -1), Vector(-1, 0), Vector(0, 1)]:
      neighbor_position: Vector = position + neighbor
      if neighbor_position.x < 0 or neighbor_position.x >= len(lines[0]) \
          or neighbor_position.y < 0 or neighbor_position.y >= len(lines) \
          or neighbor_position in forest \
          or neighbor_position in visited:
        continue
      elif neighbor_position in down_slopes and neighbor.y != 1:
        continue
      elif neighbor_position in right_slopes and neighbor.x != 1:
        continue

      next_positions.append(neighbor_position)

    if len(next_positions) > 0:
      stack.append((next_positions[0], steps + 1, visited))
      for next_position in next_positions[1:]:
        stack.append((next_position, steps + 1, set(visited)))

  return max_steps

class GraphNode:
  def __init__(self, position: Vector) -> None:
    self.position = position
    self.neighbors = {}

  def __str__(self) -> str:
    return f'{self.position} - neighbors: {"; ".join(f"{position}:{steps}" for position, steps in self.neighbors.items())}'

  def __repr__(self) -> str:
    return str(self)

def parse_graph(lines: list[str]) -> dict[Vector, GraphNode]:
  forest, _, _ = parse_forest_and_slopes(lines)
  start: Vector = Vector(1, 0)
  start_node: GraphNode = GraphNode(start)
  target: Vector = Vector(len(lines[0]) - 2, len(lines) - 1)
  target_node: GraphNode = GraphNode(target)
  stack: list[tuple[Vector, GraphNode, int]] = [(start, start_node, 0)]
  nodes: dict[Vector, GraphNode] = { start: start_node, target: target_node }
  visited: set[Vector] = set()

  while stack:
    position, previous_node, steps = stack.pop()

    if position in nodes:
      previous_node.neighbors[position] = steps
      nodes[position].neighbors[previous_node.position] = steps
      previous_node = nodes[position]
      steps = 0

    if position.x < 0 or position.x >= len(lines[0]) \
        or position.y < 0 or position.y >= len(lines) \
        or position in visited:
      continue

    visited.add(position)

    next_positions: list[Vector] = []
    for direction in [Vector(1, 0), Vector(0, -1), Vector(-1, 0), Vector(0, 1)]:
      neighbor_position: Vector = position + direction
      if neighbor_position not in forest:
        next_positions.append(neighbor_position)

    if len(next_positions) > 2:
      if position not in nodes:
        nodes[position] = GraphNode(position)
      current_node: GraphNode = nodes[position]
      previous_node.neighbors[position] = steps
      current_node.neighbors[previous_node.position] = steps
      previous_node = current_node
      steps = 0

    for next_position in next_positions:
      stack.append((next_position, previous_node, steps + 1))

  return nodes

def find_longest_path_aggregated(lines: list[str]) -> int:
  graph: dict[Vector, GraphNode] = parse_graph(lines)
  start: Vector = Vector(1, 0)
  target: Vector = Vector(len(lines[0]) - 2, len(lines) - 1)
  stack: list[tuple[GraphNode, int, set[Vector]]] = [(graph[start], 0, set())]
  max_steps: int = 0

  while stack:
    node, steps, visited = stack.pop()

    if node.position == target:
      max_steps = max(max_steps, steps)
      continue
    elif node.position in visited:
      continue

    visited.add(node.position)

    for neighbor, neighbor_steps in node.neighbors.items():
      stack.append((graph[neighbor], steps + neighbor_steps, set(visited)))

  return max_steps
