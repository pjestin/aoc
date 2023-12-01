DIGITS: list[str] = {
  "one": 1,
  "two": 2,
  "three": 3,
  "four": 4,
  "five": 5,
  "six": 6,
  "seven": 7,
  "eight": 8,
  "nine": 9
}


def get_calibration_for_line(line: str) -> int:
  first: optional[str] = None
  last: optional[str] = None

  for i in range(len(line)):
    if line[i].isdigit():
      first = line[i]
      break

  for i in range(len(line) - 1, -1, -1):
    if line[i].isdigit():
      last = line[i]
      break

  return int(first + last)


def sum_calibration_values(lines: list[str]) -> int:
  result: int = 0

  for line in lines:
    result += get_calibration_for_line(line)

  return result


def get_digits_in_line(line: str) -> list[int]:
  digits: list[int] = []

  for i in range(len(line)):
    if line[i].isdigit():
      digits.append(line[i])
      continue

    for j in range(i + 1, min(len(line) + 1, i + 6)):
      if line[i:j] in DIGITS:
        digits.append(DIGITS[line[i:j]])
        break
  
  return digits


def sum_calibration_str_digits(lines: list[str]) -> int:
  result: int = 0

  for line in lines:
    digits: list[int] = get_digits_in_line(line)
    result += int(str(digits[0]) + str(digits[-1]))

  return result
