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

def min_length(arrangement: Arrangement, group_index: int) -> int:
  length: int = 0
  for group in arrangement.groups[group_index:]:
    length += group + 1
  return length - 1

def possibilities(arrangement: Arrangement, data_index: int, group_index: int, cache: dict[int, int]) -> int:
  if group_index >= len(arrangement.groups):
    return 0 if "#" in arrangement.data[data_index:] else 1
  
  max_data_index: int = len(arrangement.data) - min_length(arrangement, group_index)
  if data_index > max_data_index:
    return 0

  h: int = data_index + 1000 * group_index
  if h in cache:
    return cache[h]

  result: int = 0

  if arrangement.data[data_index] != "#":
    result += possibilities(arrangement, data_index + 1, group_index, cache)

  if data_index == 0 or arrangement.data[data_index - 1] != "#":
    group: int = arrangement.groups[group_index]
    count: int = 0
    for index_to_check in range(data_index, data_index + group):
      if arrangement.data[index_to_check] == ".":
        break
      else:
        count += 1
    if count == group \
        and (data_index + group == len(arrangement.data) or arrangement.data[data_index + group] != "#"):
      result += possibilities(arrangement, data_index + group + 1, group_index + 1, cache)

  cache[h] = result
  return result

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

  result: int = 0
  for arrangement in arrangements:
    cache: dict[int, int] = {}
    pos: int = possibilities(arrangement, 0, 0, cache)
    result += pos

  return result
