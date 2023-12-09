import functools
import math
import re

def parse_races(lines: list[str]) -> list[tuple[int, int]]:
  times: list[str] = re.split(r"\s+", lines[0])
  times.pop(0)
  time_numbers: list[int] = list(map(int, times))

  distances: list[str] = re.split(r"\s+", lines[1])
  distances.pop(0)
  distance_numbers: list[int] = list(map(int, distances))

  return list(map(lambda index: (time_numbers[index], distance_numbers[index]), range(len(times))))

def nb_ways(race: tuple[int, int]) -> int:
  time, distance = race
  delta: int = pow(time, 2) - 4 * distance

  if delta < 0:
    return 0
  else:
    lower_bound: int = math.floor((time - math.sqrt(delta)) / 2 + 1)
    higher_bound: int = math.ceil((time + math.sqrt(delta)) / 2 - 1)
    return higher_bound - lower_bound + 1

def multiply_ways_to_beat(lines: list[str]) -> int:
  races: list[tuple[int, int]] = parse_races(lines)
  return functools.reduce(
    lambda previous, ways: previous * ways,
    map(nb_ways, races),
    1,
  )

def parse_aggregated_race(lines: list[str]) -> (int, int):
  time_str: str = lines[0].split(":")[1]
  time: int = int(time_str.replace(" ", ""))

  distance_str: str = lines[1].split(":")[1]
  distance: int = int(distance_str.replace(" ", ""))

  return (time, distance)

def ways_to_beat_aggregated(lines: list[str]) -> int:
  race = parse_aggregated_race(lines)
  return nb_ways(race)
