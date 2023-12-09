from typing import Optional
import functools 

class Range:
  def __init__(self, dest: int, source: int, length: int) -> None:
    self.dest = dest
    self.source = source
    self.length = length
  
  def __str__(self) -> str:
    return f"{self.dest} {self.source} {self.length}"

  def __repr__(self) -> str:
    return str(self)

def parse_input(lines: list[str]) -> (list[int], list[list[Range]]):
  seeds: list[int] = []
  maps: list[list[Range]] = []
  current_map: list[Range] = []

  for line in lines:
    if "seeds" in line:
      seeds_str: str = line.split(": ")[1]
      seeds = list(map(int, seeds_str.split()))
    elif "map" in line:
      if current_map:
        maps.append(current_map)
      current_map = []
    elif len(line) > 0:
      range_numbers: list[int] = list(map(int, line.split()))
      current_map.append(Range(range_numbers[0], range_numbers[1], range_numbers[2]))
    
  maps.append(current_map)
  
  return seeds, maps

def transform(element: int, mapping: list[Range]) -> int:
  for mapping_range in mapping:
    if element >= mapping_range.source and element < mapping_range.source + mapping_range.length:
      return element + mapping_range.dest - mapping_range.source

  return element

def find_closest_seed(lines: list[str]) -> int:
  seeds, maps = parse_input(lines)
  closest_location: Optional[int] = None

  for seed in seeds:
    current: int = seed
    for mapping in maps:
      current = transform(current, mapping)
    
    if not closest_location or abs(current) < closest_location:
      closest_location = current
  
  return closest_location

def split_ranges(ranges: list[tuple[int, int]], mapping: list[Range]) -> list[tuple[int, int]]:
  for mapping_range in mapping:
    transformed_ranges: list[tuple[int, int]] = []
    for range_start, range_length in ranges:
      if range_start < mapping_range.source < range_start + range_length:
        transformed_ranges.append((range_start, mapping_range.source - range_start))
        transformed_ranges.append((mapping_range.source, range_start + range_length - mapping_range.source))
      else:
        transformed_ranges.append((range_start, range_length))
    
    new_ranges: list[tuple[int, int]] = []
    for range_start, range_length in transformed_ranges:
      if range_start < mapping_range.source + mapping_range.length < range_start + range_length:
        new_ranges.append((range_start, mapping_range.source + mapping_range.length - range_start))
        new_ranges.append((mapping_range.source + mapping_range.length, range_start + range_length - mapping_range.source - mapping_range.length))
      else:
        new_ranges.append((range_start, range_length))

    ranges = new_ranges
  
  return ranges

def find_closest_seed_with_ranges(lines: list[str]) -> int:
  seeds, maps = parse_input(lines)
  ranges: list[tuple[int, int]] = [
    (seeds[2 * i], seeds[2 * i + 1]) for i in range(len(seeds) // 2)
  ]

  for mapping in maps:
    splt_ranges: list[tuple[int, int]] = split_ranges(ranges, mapping)
    transformed_ranges: list[tuple[int, int]] = []
    for range_start, range_length in splt_ranges:
      transformed_start: int = transform(range_start, mapping)
      transformed_length: int = transform(range_start + range_length - 1, mapping) - transformed_start + 1
      transformed_ranges.append((transformed_start, transformed_length))
    ranges = transformed_ranges
  
  return functools.reduce(
    lambda previous, range: range[0] if not previous or abs(range[0]) < abs(previous) else previous,
    ranges,
    None
  )

