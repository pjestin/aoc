from typing import Optional

def parse_patterns(lines: list[str]) -> list[list[list[bool]]]:
  patterns: list[list[list[bool]]] = []
  current_pattern: list[list[bool]] = []

  for line in lines:
    if not line:
      patterns.append(current_pattern)
      current_pattern = []
      continue

    current_pattern.append(list(map(lambda c: c == "#", line)))

  patterns.append(current_pattern)
  return patterns

def get_row_identifiers(pattern: list[list[bool]]) -> list[int]:
  identifiers: list[int] = []

  for row in range(len(pattern)):
    identifier: int = 0
    factor: int = 1

    for col in range(len(pattern[0])):
      identifier += factor * (1 if pattern[row][col] else 0)
      factor *= 2

    identifiers.append(identifier)

  return identifiers

def get_col_identifiers(pattern: list[list[bool]]) -> list[int]:
  identifiers: list[int] = []

  for col in range(len(pattern[0])):
    identifier: int = 0

    for row in range(len(pattern)):
      identifier |= (1 if pattern[row][col] else 0) << row

    identifiers.append(identifier)

  return identifiers

def check_symmetries(identifiers: list[int], expected_diff: int) -> Optional[int]:
  for symmetry_index in range(0, len(identifiers) - 1):
    diff: int = 0
    diff_too_large: bool = False

    for index in range(max(0, 2 * (symmetry_index + 1) - len(identifiers)), symmetry_index + 1):
      bit_diff: int = identifiers[index] ^ identifiers[2 * symmetry_index - index + 1]
      if bit_diff > 0 and bit_diff & (bit_diff - 1) == 0:
        diff += 1
      elif bit_diff > 0:
        diff_too_large = True
        break

    if not diff_too_large and diff == expected_diff:
      return symmetry_index

def summarize_symmetries(lines: list[str], expected_diff: int) -> int:
  patterns: list[list[list[bool]]] = parse_patterns(lines)
  result: int = 0

  for pattern in patterns:
    row_identifiers: list[int] = get_row_identifiers(pattern)
    row_symmetry: Optional[int] = check_symmetries(row_identifiers, expected_diff)
    if row_symmetry is not None:
      result += 100 * (row_symmetry + 1)
      continue

    col_identifiers: list[int] = get_col_identifiers(pattern)
    col_symmetry: Optional[int] = check_symmetries(col_identifiers, expected_diff)
    if col_symmetry is not None:
      result += col_symmetry + 1

  return result
