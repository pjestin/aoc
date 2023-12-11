from lib.vector import Vector

def find_star_positions(grid: list[list[str]]) -> list[Vector]:
  star_positions: list[Vector] = []

  for row in range(len(grid)):
    for col in range(len(grid[0])):
      if grid[row][col] == "#":
        star_positions.append(Vector(col, row))

  return star_positions

def get_rows_cols_to_expand(grid: list[list[str]]) -> (list[int], list[int]):
  rows_to_expand: list[int] = []
  cols_to_expand: list[int] = []

  for row in range(len(grid)):
    has_star: bool = False
    for col in range(len(grid[0])):
      if grid[row][col] == "#":
        has_star = True
        break
    if not has_star:
      rows_to_expand.append(row)

  for col in range(len(grid[0])):
    has_star: bool = False
    for row in range(len(grid)):
      if grid[row][col] == "#":
        has_star = True
        break
    if not has_star:
      cols_to_expand.append(col)

  return rows_to_expand, cols_to_expand

def expand(star_positions: list[Vector], grid: list[list[str]], expand_factor: int) -> list[Vector]:
  rows_to_expand, cols_to_expand = get_rows_cols_to_expand(grid)

  new_star_positions: list[Vector] = []
  for star_position in star_positions:
    row_index: int = 0
    while row_index < len(rows_to_expand) and rows_to_expand[row_index] < star_position.y:
      row_index += 1
    col_index: int = 0
    while col_index < len(cols_to_expand) and cols_to_expand[col_index] < star_position.x:
      col_index += 1
    new_star_positions.append(Vector(
      star_position.x + (expand_factor - 1) * col_index,
      star_position.y + (expand_factor - 1) * row_index
    ))

  return new_star_positions

def sum_closest_paths(lines: list[str], expand_factor: int) -> int:
  grid: list[list[str]] = list(map(list, lines))
  star_positions: list[Vector] = find_star_positions(grid)
  star_positions = expand(star_positions, grid, expand_factor)
  result: int = 0

  for i in range(len(star_positions)):
    for j in range(i + 1, len(star_positions)):
      star1: Vector = star_positions[i]
      star2: Vector = star_positions[j]
      result += star1.distance(star2)

  return result
