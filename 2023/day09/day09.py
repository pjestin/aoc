import functools 

def parse_history(history_line: str) -> list[int]:
  return list(map(int, history_line.split()))

def derivative(lst: list[int]) -> (list[int], bool):
  if len(lst) <= 1:
    return []

  previous: int = lst[0]
  deriv: list[int] = []
  all_zeros: bool = True

  for i in range(1, len(lst)):
    next_deriv: int = lst[i] - previous
    previous = lst[i]
    deriv.append(next_deriv)
    if next_deriv != 0:
      all_zeros = False
  
  return deriv, all_zeros

def compute_derivs(lst: list[int]) -> list[list[int]]:
  current: list[int] = lst
  derivs: list[list[int]] = [lst]
  all_zeros: bool = False

  while not all_zeros:
    deriv, all_zeros = derivative(current)
    current = deriv
    derivs.append(deriv)
  
  return derivs

def extrapolate(history: list[int]) -> int:
  derivs: list[list[int]] = compute_derivs(history)
  
  derivs[-1].append(0)
  for i in range(len(derivs) - 2, -1, -1):
    extrapolated: int = derivs[i][-1] + derivs[i + 1][-1]
    derivs[i].append(extrapolated)

  return derivs[0][-1]

def sum_extrapolated(lines: list[str]) -> int:
  oasis: list[list[int]] = list(map(parse_history, lines))
  return functools.reduce(lambda previous, history: previous + extrapolate(history), oasis, 0)

def extrapolate_backwards(history: list[int]) -> int:
  derivs: list[list[int]] = compute_derivs(history)

  derivs[-1].append(0)
  for i in range(len(derivs) - 2, -1, -1):
    extrapolated: int = derivs[i][0] - derivs[i + 1][0]
    derivs[i].insert(0, extrapolated)

  return derivs[0][0]

def sum_extrapolated_backwards(lines: list[str]) -> int:
  oasis: list[list[int]] = list(map(parse_history, lines))
  return functools.reduce(lambda previous, history: previous + extrapolate_backwards(history), oasis, 0)
