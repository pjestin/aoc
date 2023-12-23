from typing import Optional

NB_BOXES: int = 256

def hash(s: str) -> int:
  current: int = 0
  for c in s:
    ascii_code: int = ord(c)
    current = ((current + ascii_code) * 17) % 256
  return current

def sum_initialization_hashes(line: str) -> int:
  return sum(map(hash, line.split(",")))

class InitializationStep:
  def __init__(self, label: str, operation: str, focal_length: Optional[int]):
    self.label = label
    self.operation = operation
    self.focal_length = focal_length

def parse_initialization_sequence(line: str):
  steps: list[InitializationStep] = []

  for step_str in line.split(","):
    equals_index: int = step_str.find("=")
    dash_index: int = step_str.find("-")
    operation_index: int = max(equals_index, dash_index)
    label: str = step_str[:operation_index]
    operation: str = step_str[operation_index]
    focal_length: Optional[int] = int(step_str[operation_index + 1:]) if equals_index >= 0 else None
    steps.append(InitializationStep(label, operation, focal_length))

  return steps

class HashMap:
  def __init__(self) -> None:
    self.boxes = [[] for _ in range(NB_BOXES)]

  def apply(self, step: InitializationStep) -> None:
    label_hash: int = hash(step.label)
    box: list[tuple[str, int]] = self.boxes[label_hash]
    found_element: bool = False
    for index in range(len(box)):
      if box[index][0] == step.label:
        if step.operation == "=":
          box[index] = (step.label, step.focal_length)
          found_element = True
        else:
          box.pop(index)
        break
    if not found_element and step.operation == "=":
      box.append((step.label, step.focal_length))

  def focusing_power(self) -> int:
    power: int = 0
  
    for box_id, box in enumerate(self.boxes):
      for lens_rank, label_focal_length in enumerate(box):
        power += (box_id + 1) * (lens_rank + 1) * label_focal_length[1]

    return power

def sum_focusing_power(line: str) -> int:
  steps: list[InitializationStep] = parse_initialization_sequence(line)
  hashmap: HashMap = HashMap()

  for step in steps:
    hashmap.apply(step)

  return hashmap.focusing_power()
