from enum import Enum
import functools

from lib.math import lcm

class PulseType(Enum):
  LOW = 0
  HIGH = 1

class Module:
  def __init__(self, name: str, inputs: list[str], outputs: list[str]) -> None:
    self.name = name
    self.inputs = inputs
    self.outputs = outputs

  def __str__(self) -> str:
    return f"{self.name}; {self.inputs}; {self.outputs}"

  def __repr__(self) -> str:
    return str(self)

  def send(self, *_) -> None:
    pass

class Broadcaster(Module):
  def send(self, _: str, pulse_type: PulseType, queue: list[tuple[str, PulseType, str]]) -> None:
    for output in self.outputs:
      queue.append((self.name, pulse_type, output))

class FlipFlop(Module):
  def __init__(self, name: str, inputs: list[str], outputs: list[str]) -> None:
    super().__init__(name, inputs, outputs)
    self.on = False

  def __str__(self) -> str:
    return f"{self.name}; {self.inputs}; {self.outputs}; {self.on}"

  def __repr__(self) -> str:
    return str(self)

  def send(self, _: str, pulse_type: PulseType, queue: list[tuple[str, PulseType, str]]) -> None:
    if pulse_type == PulseType.LOW:
      self.on = not self.on
      pulse_type_to_send: PulseType = PulseType.HIGH if self.on else PulseType.LOW
      for output in self.outputs:
        queue.append((self.name, pulse_type_to_send, output))

class Conjunction(Module):
  def __init__(self, name: str, inputs: list[str], outputs: list[str]) -> None:
    super().__init__(name, inputs, outputs)
    self.input_pulses = {}

  def __str__(self) -> str:
    return f"{self.name}; {self.inputs}; {self.outputs}; {self.input_pulses}"

  def __repr__(self) -> str:
    return str(self)

  def send(self, input: str, pulse_type: PulseType, queue: list[tuple[str, PulseType, str]]) -> None:
    self.input_pulses[input] = pulse_type
    pulse_type_to_send: PulseType = PulseType.HIGH \
      if PulseType.LOW in self.input_pulses.values() \
      else PulseType.LOW
    for output in self.outputs:
      queue.append((self.name, pulse_type_to_send, output))

def parse_modules(lines: list[str]) -> dict[str, Module]:
  modules: dict[str, Module] = {}

  for line in lines:
    split_module: list[str] = line.split(" -> ")
    name: str = split_module[0]
    outputs: list[str] = split_module[1].split(", ")

    if name == "broadcaster":
      modules["broadcaster"] = Broadcaster("broadcaster", [], outputs)
    elif name.startswith("%"):
      modules[name[1:]] = FlipFlop(name[1:], [], outputs)
    elif name.startswith("&"):
      modules[name[1:]] = Conjunction(name[1:], [], outputs)
    else:
      modules[name] = Module(name, [], outputs)

  for line in lines:
    split_module: list[str] = line.split(" -> ")
    name: str = split_module[0]
    outputs: list[str] = split_module[1].split(", ")

    for output in outputs:
      if output not in modules:
        modules[output] = Module(output, [], [])
      modules[output].inputs.append(name.lstrip("%").lstrip("&"))

  for module in modules.values():
    if isinstance(module, Conjunction):
      module.input_pulses = { input: PulseType.LOW for input in module.inputs }

  return modules

def all_flip_flops_off(modules: dict[str, Module]) -> bool:
  for module in modules.values():
    if isinstance(module, FlipFlop) and module.on:
      return False

  return True

def count_pulses(lines: list[str]) -> int:
  modules: dict[str, Module] = parse_modules(lines)
  nb_low_pulses: int = 0
  nb_high_pulses: int = 0
  button_count: int = 0
  queue: list[tuple[str, PulseType]] = []

  while button_count < 1000 and (button_count == 0 or not all_flip_flops_off(modules)):
    if not queue:
      queue.append(("button", PulseType.LOW, "broadcaster"))
    button_count += 1

    while queue:
      module_name, pulse_type, destination = queue.pop(0)
      module: Module = modules[destination]
      module.send(module_name, pulse_type, queue)
      match pulse_type:
        case PulseType.LOW:
          nb_low_pulses += 1
        case PulseType.HIGH:
          nb_high_pulses += 1

  return (nb_low_pulses * 1000 // button_count) * (nb_high_pulses * 1000 // button_count)

def find_fewest_rx_button(lines: list[str]) -> int:
  modules: dict[str, Module] = parse_modules(lines)
  button_count: int = 0
  queue: list[tuple[str, PulseType]] = []
  conjuctions: list[Module] = list(filter(lambda module: isinstance(module, Conjunction), modules.values()))
  nb_conjunction_inputs: int = sum(len(conjuction.inputs) for conjuction in conjuctions)
  print(conjuctions)
  print(nb_conjunction_inputs)
  conjunction_inputs_with_high: set[str] = set()
  cycles: dict[str, int] = {}

  while len(cycles) < nb_conjunction_inputs:# and button_count < 10000:
    for conjunction in conjuctions:
      for input_name, pulse_type in conjunction.input_pulses.items():
        conjunction_and_input: str = f"{conjunction.name}:{input_name}"
        # if pulse_type == PulseType.HIGH:
        #   conjunction_inputs_with_high.add(conjunction_and_input)
        # if conjunction_and_input in conjunction_inputs_with_high \
        if pulse_type == PulseType.HIGH \
            and conjunction_and_input not in cycles:
          cycles[conjunction_and_input] = button_count
          print(cycles)

    queue.append(("button", PulseType.LOW, "broadcaster"))
    button_count += 1

    while queue:
      module_name, pulse_type, destination = queue.pop(0)
      if destination == "rx" and pulse_type == PulseType.LOW:
        return button_count

      module: Module = modules[destination]
      module.send(module_name, pulse_type, queue)

  return functools.reduce(
    lambda previous, cycle_length: lcm(previous, cycle_length),
    cycles.values(),
    1,
  )
