from lib.vector import Vector

def find_start(lines: list[str]) -> Vector:
  for row in range(len(lines)):
    for col in range(len(lines[0])):
      if lines[row][col] == "S":
        return Vector(col, row)
  
  raise RuntimeError("No starting point")

def correct_start(grid: list[list[str]], start: Vector) -> list[list[str]]:
  connections: int = 0
  if start.x > 0 and grid[start.y][start.x - 1] in ["-", "L", "F"]:
    connections += 1
  if start.y > 0 and grid[start.y - 1][start.x] in ["|", "7", "F"]:
    connections += 2
  if start.x < len(grid[0]) - 1 and grid[start.y][start.x + 1] in ["-", "J", "7"]:
    connections += 4
  if start.y < len(grid) - 1 and grid[start.y + 1][start.x] in ["|", "L", "J"]:
    connections += 8

  match connections:
    case 3:
      grid[start.y][start.x] = "J"
    case 5:
      grid[start.y][start.x] = "-"
    case 6:
      grid[start.y][start.x] = "L"
    case 9:
      grid[start.y][start.x] = "7"
    case 10:
      grid[start.y][start.x] = "|"
    case 12:
      grid[start.y][start.x] = "F"

def navigate(lines: list[str], current: Vector, visited: set[Vector]) -> Vector:
  current_pipe: str = lines[current.y][current.x]
  if current_pipe in ["-", "J", "7"] and current.x > 0 and Vector(current.x - 1, current.y) not in visited:
    return Vector(current.x - 1, current.y)
  elif current_pipe in ["|", "L", "J"] and current.y > 0 and Vector(current.x, current.y - 1) not in visited:
    return Vector(current.x, current.y - 1)
  elif current_pipe in ["-", "L", "F"] and current.x < len(lines[0]) - 1 and Vector(current.x + 1, current.y) not in visited:
    return Vector(current.x + 1, current.y)
  elif current_pipe in ["|", "7", "F"] and current.y < len(lines) - 1 and Vector(current.x, current.y + 1) not in visited:
    return Vector(current.x, current.y + 1)
  else:
    RuntimeError("No pipes to go!")

def find_pipe_positions(grid: list[list[str]], start: Vector) -> set[Vector]:
  currents: list[Vector] = []
  if start.x > 0 and grid[start.y][start.x - 1] in ["-", "L", "F"]:
    currents.append(Vector(start.x - 1, start.y))
  if start.y > 0 and grid[start.y - 1][start.x] in ["|", "7", "F"]:
    currents.append(Vector(start.x, start.y - 1))
  if start.x < len(grid[0]) - 1 and grid[start.y][start.x + 1] in ["-", "J", "7"]:
    currents.append(Vector(start.x + 1, start.y))
  if start.y < len(grid) - 1 and grid[start.y + 1][start.x] in ["|", "L", "J"]:
    currents.append(Vector(start.x, start.y + 1))
  if len(currents) != 2:
    raise RuntimeError("Not 2 starting points")
  left, right = currents

  pipe_positions: set[Vector] = set([start])

  while left != right:
    pipe_positions.add(left)
    pipe_positions.add(right)
    left = navigate(grid, left, pipe_positions)
    right = navigate(grid, right, pipe_positions)

  pipe_positions.add(left)
  return pipe_positions

def find_farthest_distance(lines: list[str]) -> int:
  grid: list[list[str]] = list(map(list, lines))
  start: Vector = find_start(grid)
  pipe_positions: set[Vector] = find_pipe_positions(grid, start)  

  return len(pipe_positions) // 2

def count_enclosed_tiles(lines: list[str]) -> int:
  grid: list[list[str]] = list(map(list, lines))
  start: Vector = find_start(grid)
  correct_start(grid, start)
  pipe_positions: set[Vector] = find_pipe_positions(grid, start)

  result: int = 0
  for row in range(len(grid)):
    for col in range(len(grid[0])):
      if Vector(col, row) not in pipe_positions:
        current_row: int = row - 1
        current_col: int = col - 1
        nb_cross: int = 0
        while current_row >= 0 and current_col >= 0:
          if Vector(current_col, current_row) in pipe_positions and grid[current_row][current_col] in ["-", "|", "J", "F"]:
            nb_cross += 1
          current_row -= 1
          current_col -= 1
        if nb_cross % 2 == 1:
          result += 1

  return result
