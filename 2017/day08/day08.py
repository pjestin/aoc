from typing import Callable


class Instruction:
    def __init__(
        self,
        register_name: str,
        increase_factor: int,
        increase_value: int,
        condition_register: str,
        condition_lambda: Callable[[int], bool],
    ):
        self.register_name = register_name
        self.increase_factor = increase_factor
        self.increase_value = increase_value
        self.condition_register = condition_register
        self.condition_lambda = condition_lambda

    @classmethod
    def parse_condition(
        cls, condition_value: int, operator: str
    ) -> Callable[[int], bool]:
        return {
            ">": lambda x: x > condition_value,
            "<": lambda x: x < condition_value,
            ">=": lambda x: x >= condition_value,
            "<=": lambda x: x <= condition_value,
            "==": lambda x: x == condition_value,
            "!=": lambda x: x != condition_value,
        }[operator]

    @classmethod
    def parse(cls, line: str):
        split_line: list[str] = line.split()
        register_name = split_line[0]
        assert split_line[1] in ["inc", "dec"]
        increase_factor = 1 if split_line[1] == "inc" else -1
        increase_value = int(split_line[2])
        condition_register = split_line[4]
        condition_value = int(split_line[6])
        condition_lambda = cls.parse_condition(condition_value, split_line[5])
        return Instruction(
            register_name,
            increase_factor,
            increase_value,
            condition_register,
            condition_lambda,
        )

    def execute(self, registers: dict[str, int]):
        if self.condition_register not in registers:
            registers[self.condition_register] = 0
        register_value = registers[self.condition_register]
        if self.condition_lambda(register_value):
            if self.register_name not in registers:
                registers[self.register_name] = 0
            registers[self.register_name] += self.increase_factor * self.increase_value


def parse_instructions(lines: list[str]) -> list[Instruction]:
    return list(map(Instruction.parse, lines))


def execute_and_find_largest_value(lines: list[str]) -> int:
    instructions: list[Instruction] = parse_instructions(lines)
    registers: dict[str, int] = {}
    for instruction in instructions:
        instruction.execute(registers)
    return max(registers.values())


def find_highest_held_value(lines: list[str]) -> int:
    instructions: list[Instruction] = parse_instructions(lines)
    registers: dict[str, int] = {}
    max_value = 0
    for instruction in instructions:
        instruction.execute(registers)
        max_value = max(max_value, max(registers.values()))
    return max_value
