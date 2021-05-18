def sum_next_matching_digits(line: str) -> int:
    sum: int = 0
    for index in range(len(line)):
        nextIndex: int = (index + 1) % len(line)
        if line[index] == line[nextIndex]:
            sum += int(line[index])
    return sum

def sum_halfway_matching_digits(line: str) -> int:
    sum: int = 0
    for index in range(len(line)):
        halfwayIndex: int = (index + len(line) // 2) % len(line)
        if line[index] == line[halfwayIndex]:
            sum += int(line[index])
    return sum
