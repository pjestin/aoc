def __find_line_difference(line: str) -> int:
    int_list: list[int] = list(map(int, line.split()))
    smallest: int = min(int_list)
    largest: int = max(int_list)
    return largest - smallest


def find_checksum_by_smallest_largest(lines: list[str]) -> int:
    return sum(__find_line_difference(line) for line in lines)


def __find_even_division(line: str) -> int:
    int_list: list[int] = list(map(int, line.split()))
    for x in int_list:
        for y in int_list:
            if x != y and x % y == 0:
                return x // y
    return 0


def find_checksum_by_evenly_divisible(lines: list[str]) -> int:
    return sum(__find_even_division(line) for line in lines)
