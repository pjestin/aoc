from enum import Enum
import functools
import re
from typing import Optional

from lib.math import lcm

GRAPH_PATTERN: str = r"(\w+) = \((\w+), (\w+)\)"

class Instruction(Enum):
  L = 1
  R = 2

def parse_graph(lines: list[str]) -> (dict[str, tuple[str, str]], list[str]):
  instructions: list[Instruction] = list(map(lambda c: Instruction[c], list(lines[0])))
  graph: dict[str, tuple[str, str]] = {}

  for line in lines[2:]:
    graph_match: Optional[re.Match] = re.match(GRAPH_PATTERN, line)
    graph[graph_match.group(1)] = (graph_match.group(2), graph_match.group(3))

  return instructions, graph

def count_steps(lines: list[str]) -> int:
  instructions, graph = parse_graph(lines)
  index: int = 0
  current: str = "AAA"

  while current != "ZZZ":
    match instructions[index % len(instructions)]:
      case Instruction.L:
        current = graph[current][0]
      case Instruction.R:
        current = graph[current][1]

    index += 1

  return index

def get_cycles(instructions: list[Instruction], graph: [dict[str, tuple[str, str]]], nodes: list[str]) -> dict[str, int]:
  cycles: dict[str, int] = {}
  index: int = 0

  while not len(cycles) == len(nodes):
    for node_index in range(len(nodes)):
      match instructions[index % len(instructions)]:
        case Instruction.L:
          nodes[node_index] = graph[nodes[node_index]][0]
        case Instruction.R:
          nodes[node_index] = graph[nodes[node_index]][1]
      if nodes[node_index][-1] == "Z" and nodes[node_index] not in cycles:
        cycles[nodes[node_index]] = index

    index += 1

  return cycles

def count_steps_ghost(lines: list[str]) -> int:
  instructions, graph = parse_graph(lines)
  nodes: list[str] = list(filter(lambda node: node[-1] == "A", graph.keys()))
  cycles: dict[str, int] = get_cycles(instructions, graph, nodes)

  return functools.reduce(lambda previous, cycle: lcm(previous, cycle + 1), cycles.values(), 1)
