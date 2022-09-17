def __parse_scanner_ranges(lines: list[str]) -> dict[int, int]:
    scanner_ranges: dict[int, int] = {}
    for line in lines:
        split_line = line.split(": ")
        depth = int(split_line[0])
        range = int(split_line[1])
        scanner_ranges[depth] = range
    return scanner_ranges


def __is_caught(step: int, scanner_range: int) -> int:
    if scanner_range == 0:
        return True
    if scanner_range == 1:
        return step % 2 == 0
    return step % (2 * scanner_range - 2) == 0


def find_trip_severity(lines: list[str]) -> int:
    scanner_ranges: dict[int, int] = __parse_scanner_ranges(lines)
    max_depth: int = max(scanner_ranges.keys())
    severity = 0
    for depth in range(max_depth + 1):
        if depth in scanner_ranges:
            scanner_range: int = scanner_ranges[depth]
            if __is_caught(depth, scanner_range):
                severity += depth * scanner_range
    return severity


def __is_delay_valid(delay: int, scanner_ranges: dict[int, int]) -> bool:
    for depth, scanner_range in scanner_ranges.items():
        if __is_caught(depth + delay, scanner_range):
            return False
    return True


def find_least_delay(lines: list[str]) -> int:
    scanner_ranges: dict[int, int] = __parse_scanner_ranges(lines)
    delay = 0
    while not __is_delay_valid(delay, scanner_ranges):
        delay += 1
    return delay
