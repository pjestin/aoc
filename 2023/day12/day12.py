class Arrangement:
  def __init__(self, data: list[str], groups: list[int]) -> None:
    self.data = data
    self.groups = groups

  def __str__(self) -> str:
    return f"{''.join(self.data)} {self.groups}"

  def __repr__(self) -> str:
    return str(self)

def parse_arrangements(lines: list[str]) -> list[Arrangement]:
  result: list[Arrangement] = []

  for line in lines:
    data_str: str = line.split()[0]
    data_lst: list[str] = list(data_str)
    groups_str: str = line.split()[1]
    groups_int: list[int] = list(map(int, groups_str.split(",")))
    result.append(Arrangement(data_lst, groups_int))

  return result

def is_valid(data: list[str], groups: list[int]) -> bool:
  if "?" in data:
    return False

  current_group_size: int = 0
  group_index: int = 0
  for c in data:
    if c == "#":
      current_group_size += 1
    elif current_group_size > 0:
      if group_index >= len(groups) or current_group_size != groups[group_index]:
        return False
      current_group_size = 0
      group_index += 1

  if current_group_size > 0:
    if group_index >= len(groups) or current_group_size != groups[group_index]:
      return False
    group_index += 1

  return group_index == len(groups)

def possibilities(arrangement: Arrangement, index: int, group_index: int) -> int:
  if index == len(arrangement.data):
    return 1 if is_valid(arrangement.data, arrangement.groups) else 0

  if index > 0 and arrangement.data[index - 1] == "." and not is_valid(arrangement.data[:index], arrangement.groups[:group_index]):
    return 0

  if arrangement.data[index] == "?":
    result: int = 0
    arrangement.data[index] = "#"
    result += possibilities(arrangement, index + 1, group_index)
    arrangement.data[index] = "."
    if index > 0 and arrangement.data[index - 1] == "#":
      result += possibilities(arrangement, index + 1, group_index + 1)
    else:
      result += possibilities(arrangement, index + 1, group_index)
    arrangement.data[index] = "?"
    return result
  elif index > 0 and arrangement.data[index - 1] == "#" and arrangement.data[index] == ".":
    return possibilities(arrangement, index + 1, group_index + 1)
  else:
    return possibilities(arrangement, index + 1, group_index)

def unfold(arrangements: list[Arrangement], fold_factor: int) -> list[Arrangement]:
  unfolded_arrangements: list[Arrangement] = []

  for arrangement in arrangements:
    unfolded_data: list[str] = list(arrangement.data)
    unfolded_groups: list[int] = list(arrangement.groups)

    for _ in range(fold_factor - 1):
      unfolded_data.append("?")
      unfolded_data.extend(arrangement.data)
      unfolded_groups.extend(arrangement.groups)

    unfolded_arrangements.append(Arrangement(unfolded_data, unfolded_groups))

  return unfolded_arrangements

def sum_possibilities(lines: list[str], fold_factor: int) -> int:
  arrangements: list[Arrangement] = parse_arrangements(lines)
  arrangements: list[Arrangement] = unfold(arrangements, fold_factor)

  return sum(map(lambda arrangement: possibilities(arrangement, 0, 0), arrangements))
