import math
from lib.instruction import Instruction


class Computer:
    def __init__(self) -> None:
        self.registers: dict[str, int] = {}
        self.mul_instructions_count = 0

    def __init_registers(self, instruction: Instruction) -> None:
        if instruction.arg1_is_register() and instruction.arg1 not in self.registers:
            self.registers[instruction.arg1] = 0
        if (
            instruction.arg2
            and instruction.arg2_is_register()
            and instruction.arg2 not in self.registers
        ):
            self.registers[instruction.arg2] = 0

    def __get_value(self, instruction: Instruction) -> int:
        if not instruction.arg2:
            raise ValueError(
                "instruction {} with no 2nd argument".format(instruction.op)
            )
        return (
            self.registers[instruction.arg2]
            if instruction.arg2_is_register()
            else int(instruction.arg2)
        )

    def run(self, instructions: list[Instruction]) -> None:
        ins_index = 0
        while ins_index >= 0 and ins_index < len(instructions):
            instruction = instructions[ins_index]
            self.__init_registers(instruction)
            value: int = self.__get_value(instruction)

            if instruction.op == "set":
                self.registers[instruction.arg1] = value
            elif instruction.op == "sub":
                self.registers[instruction.arg1] -= value
            elif instruction.op == "mul":
                self.mul_instructions_count += 1
                self.registers[instruction.arg1] *= value
            elif instruction.op == "jnz":
                value_to_compare = (
                    self.registers[instruction.arg1]
                    if instruction.arg1_is_register()
                    else int(instruction.arg1)
                )
                if value_to_compare != 0:
                    ins_index += value - 1

            ins_index += 1


def count_mul_in_program(lines: list[str]) -> int:
    instructions: list[Instruction] = list(map(Instruction.parse, lines))
    computer = Computer()
    computer.run(instructions)
    return computer.mul_instructions_count


def __is_prime(a: int) -> bool:
    for d in range(2, math.isqrt(a) + 1):
        if a % d == 0:
            return False
    return True


def count_non_primes_in_range(r: range) -> int:
    non_prime_count = 0
    for a in r:
        if not __is_prime(a):
            non_prime_count += 1
    return non_prime_count
