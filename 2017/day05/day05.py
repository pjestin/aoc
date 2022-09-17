def find_steps_before_exit(lines: list[str]) -> int:
    instructions: list[int] = list(map(int, lines))
    pointer = 0
    steps = 0
    while pointer < len(instructions):
        jump = instructions[pointer]
        instructions[pointer] += 1
        pointer += jump
        steps += 1
    return steps


def find_steps_before_exit_alternative_increment(lines: list[str]) -> int:
    instructions: list[int] = list(map(int, lines))
    pointer = 0
    steps = 0
    while pointer < len(instructions):
        jump = instructions[pointer]
        if jump >= 3:
            instructions[pointer] -= 1
        else:
            instructions[pointer] += 1
        pointer += jump
        steps += 1
    return steps
