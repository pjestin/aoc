def parse_wires(lines: list[str]) -> list[tuple[str, str]]:
  wires: list[tuple[str, str]] = []

  for line in lines:
    source: str = line.split(": ")[0]
    dests: list[str] = line.split(": ")[1].split()
    for dest in dests:
      wires.append((source, dest))

  return wires

def build_graph(wires: list[tuple[str, str]]) -> dict[str, set[str]]:
  graph: dict[str, set[str]] = {}

  for wire in wires:
    if wire[0] not in graph:
      graph[wire[0]] = set()
    if wire[1] not in graph:
      graph[wire[1]] = set()

    graph[wire[0]].add(wire[1])
    graph[wire[1]].add(wire[0])

  return graph

def cut_wire(graph: dict[str, set[str]], wire: tuple[str, str]) -> None:
  graph[wire[0]].remove(wire[1])
  graph[wire[1]].remove(wire[0])

def restore_wire(graph: dict[str, set[str]], wire: tuple[str, str]) -> None:
  graph[wire[0]].add(wire[1])
  graph[wire[1]].add(wire[0])

def navigate_graph(graph: dict[str, set[str]], start: str, visited: set[str], wires_to_ignore: list[tuple[str, str]]) -> set[str]:
  stack: list[str] = [start]
  group_size: int = 0

  while len(stack) > 0:
    component: str = stack.pop()

    if component not in graph or component in visited:
      continue

    visited.add(component)
    group_size += 1

    for neighbor in graph[component]:
      ignore: bool = False
      for wire_to_ignore in wires_to_ignore:
        if sorted((component, neighbor)) == sorted(wire_to_ignore):
          ignore = True

      if not ignore:
        stack.append(neighbor)

  return group_size

def get_graph_group_sizes(graph: dict[str, set[str]], wires_to_ignore: list[tuple[str, str]]) -> list[int]:
  group_sizes: list[int] = []
  visited: set[str] = set()

  for component in graph.keys():
    group_size: int = navigate_graph(graph, component, visited, wires_to_ignore)

    if group_size > 0:
      group_sizes.append(group_size)

    if len(visited) == len(graph):
      break

  return group_sizes

def cut_three_wires(lines: list[str]) -> int:
  wires: list[tuple[str, str]] = parse_wires(lines)
  graph: dict[str, set[str]] = build_graph(wires)

  for i in range(len(wires)):
    for j in range(i + 1, len(wires)):
      for k in range(j + 1, len(wires)):
        group_sizes: list[int] = get_graph_group_sizes(graph, [wires[i], wires[j], wires[k]])
        if len(group_sizes) == 2:
          return group_sizes[0] * group_sizes[1]

  return -1
