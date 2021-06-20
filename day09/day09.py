def find_group_score(line: str) -> int:
    should_ignore_next = False
    is_garbage = False
    group_score = 0
    total_score = 0
    for char in line:
        if should_ignore_next:
            should_ignore_next = False
            continue

        if char == "!":
            should_ignore_next = True
            continue

        if char == "<":
            is_garbage = True
        elif char == ">":
            is_garbage = False

        if is_garbage:
            continue

        if char == "{":
            group_score += 1
        elif char == "}":
            total_score += group_score
            group_score -= 1

    return total_score


def count_garbage(line: str) -> int:
    should_ignore_next = False
    is_garbage = False
    garbage_count = 0
    for char in line:
        if should_ignore_next:
            should_ignore_next = False
            continue

        if char == "!":
            should_ignore_next = True
            continue

        if is_garbage and char != ">":
            garbage_count += 1
            continue

        if char == "<":
            is_garbage = True
        elif char == ">":
            is_garbage = False

    return garbage_count
