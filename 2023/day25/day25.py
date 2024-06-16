import random

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

def count_components(components: dict[str, int]) -> list[int]:
  component_sizes: dict[int, int] = {}

  for component_index in components.values():
    if component_index not in component_sizes:
      component_sizes[component_index] = 0
    component_sizes[component_index] += 1

  return list(component_sizes.values())

def karger(wires: list[tuple[str, str]], graph: dict[str, set[str]]) -> int:
  components: dict[str, int] = {}
  available_wires: list[int] = list(range(0, len(wires)))
  component_index: int = 0

  while len(available_wires) > 0 and (len(components) < len(graph) or len(set(components.values())) > 2):
    wire_index: int = available_wires.pop(random.randrange(len(available_wires)))
    wire: tuple[str, str] = wires[wire_index]
    if wire[0] in components and wire[1] in components and components[wire[0]] != components[wire[1]]:
      new_component: int = components[wire[0]]
      component_to_replace: int = components[wire[1]]
      for vertex in list(components.keys()):
        if components[vertex] == component_to_replace:
          components[vertex] = new_component
    elif wire[0] in components:
      components[wire[1]] = components[wire[0]]
    elif wire[1] in components:
      components[wire[0]] = components[wire[1]]
    else:
      components[wire[0]] = component_index
      components[wire[1]] = component_index
      component_index += 1

  component_sizes: list[int] = count_components(components)
  if len(component_sizes) == 2 and 2 not in component_sizes:
    return component_sizes[0] * component_sizes[1]

  return -1

def cut_three_wires(lines: list[str]) -> int:
  wires: list[tuple[str, str]] = parse_wires(lines)
  graph: dict[str, set[str]] = build_graph(wires)

  frequencies: dict[int, int] = {}

  for _ in range(1000):
    res: int = karger(wires, graph)
    if res == -1:
      continue
    if res not in frequencies:
      frequencies[res] = 0
    frequencies[res] += 1

  max_freq: int = 0
  max_freq_res: int = 0

  for res, freq in frequencies.items():
    if freq > max_freq:
      max_freq = freq
      max_freq_res = res

  return max_freq_res
