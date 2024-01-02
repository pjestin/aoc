from enum import Enum
import re

class Operator(Enum):
  LT = 0
  GT = 1

  def __str__(self) -> str:
    match self:
      case Operator.LT:
        return "<"
      case Operator.GT:
        return ">"

  def __repr__(self) -> str:
    return str(self)

class Rule:
  def __init__(self, rating_name: str, operator: Operator, threshold: int, destination: str) -> None:
    self.rating_name = rating_name
    self.operator = operator
    self.threshold = threshold
    self.destination = destination

  def __str__(self) -> str:
    return f"{self.rating_name}{self.operator}{self.threshold}:{self.destination}"

  def __repr__(self) -> str:
    return str(self)

  def test(self, part: dict[str, int]) -> bool:
    match self.operator:
      case Operator.LT:
        return part[self.rating_name] < self.threshold
      case Operator.GT:
        return part[self.rating_name] > self.threshold

class Workflow:
  def __init__(self, name: str, rules: list[Rule], default: str) -> None:
    self.name = name
    self.rules = rules
    self.default = default

  def __str__(self) -> str:
    return f"{self.name}{self.rules}{self.default}"

  def __repr__(self) -> str:
    return str(self)

  def get_destination(self, part: dict[str, int]) -> str:
    for rule in self.rules:
      if rule.test(part):
        return rule.destination

    return self.default

def parse_workflows_parts(lines: list[str]) -> tuple[dict[str, Workflow], list[dict[str, int]]]:
  workflows: dict[str, Workflow] = {}
  parts: list[dict[str, int]] = []

  for line in lines:
    curly_index: int = line.find("{")
    if curly_index == 0:
      part: dict[str, int] = {}
      split_part: list[str] = line[1 : len(line) - 1].split(",")
      for rating_str in split_part:
        split_rating: list[str] = rating_str.split("=")
        part[split_rating[0]] = int(split_rating[1])
      parts.append(part)
    elif curly_index > 0:
      name: str = line[:curly_index]
      split_workflow: list[str] = line[curly_index + 1 : len(line) - 1].split(",")
      rules: list[Rule] = []

      for rule_str in split_workflow[:len(split_workflow) - 1]:
        rating_name: str = re.split(r"[<>]", rule_str)[0]
        operator: Operator = Operator.LT if "<" in rule_str else Operator.GT
        threshold: int = int(re.split(r"[<>]", rule_str)[1].split(":")[0])
        destination: str = rule_str.split(":")[1]
        rules.append(Rule(rating_name, operator, threshold, destination))

      workflows[name] = Workflow(name, rules, split_workflow[-1])

  return (workflows, parts)

def sum_accepted_ratings(lines: list[str]) -> int:
  workflows, parts = parse_workflows_parts(lines)
  result: int = 0

  for part in parts:
    current_workflow: str = "in"

    while current_workflow not in ["A", "R"]:
      current_workflow = workflows[current_workflow].get_destination(part)

    if current_workflow == "A":
      result += sum(part.values())

  return result

def get_split_part_ranges(workflow: Workflow, part_range: dict[str, tuple[int, int]]) \
    -> list[tuple[str, dict[str, tuple[int, int]]]]:
  split_part_ranges: list[tuple[str, dict[str, tuple[int, int]]]] = []
  current: dict[str, tuple[int, int]] = part_range
  use_default: bool = True

  for rule in workflow.rules:
    test1: bool = rule.test({ rule.rating_name : current[rule.rating_name][0] })
    test2: bool = rule.test({ rule.rating_name : current[rule.rating_name][1] })
    if test1 and test2:
      split_part_ranges.append((rule.destination, current))
      use_default = False
      break
    elif test1 and not test2:
      split: dict[str, tuple[int, int]] = current.copy()
      split[rule.rating_name] = (split[rule.rating_name][0], rule.threshold)
      current[rule.rating_name] = (rule.threshold, current[rule.rating_name][1])
      split_part_ranges.append((rule.destination, split))
    elif not test1 and test2:
      split: dict[str, tuple[int, int]] = current.copy()
      split[rule.rating_name] = (rule.threshold + 1, split[rule.rating_name][1])
      current[rule.rating_name] = (current[rule.rating_name][0], rule.threshold + 1)
      split_part_ranges.append((rule.destination, split))

  if use_default:
    split_part_ranges.append((workflow.default, current))

  return split_part_ranges

def get_combinations(part_range: dict[str, tuple[int, int]]) -> int:
  combinations: int = 1

  for rating_range in part_range.values():
    combinations *= rating_range[1] - rating_range[0]

  return combinations

def count_distinct_combinations(lines: list[str]) -> int:
  workflows, _ = parse_workflows_parts(lines)
  combinations: int = 0

  part_ranges: list[tuple[str, dict[str, tuple[int, int]]]] = [(
    "in",
    {
      "x": (1, 4001),
      "m": (1, 4001),
      "a": (1, 4001),
      "s": (1, 4001),
    },
  )]

  while part_ranges:
    next_part_ranges: list[tuple[str, dict[str, tuple[int, int]]]] = []
    for workflow_name, part_range in part_ranges:
      workflow: Workflow = workflows[workflow_name]
      split_part_ranges: list[tuple[str, dict[str, tuple[int, int]]]] = get_split_part_ranges(workflow, part_range)
      for new_workflow_name, split_part_range in split_part_ranges:
        if new_workflow_name == "A":
          combinations += get_combinations(split_part_range)
        elif new_workflow_name != "R":
          next_part_ranges.append((new_workflow_name, split_part_range))

    part_ranges = next_part_ranges

  return combinations
