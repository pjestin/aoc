from __future__ import annotations
from typing import Optional


class Instruction:
    def __init__(self, op: str, arg1: str, arg2: Optional[str] = None) -> None:
        self.op = op
        self.arg1 = arg1
        self.arg2 = arg2

    def __str__(self) -> str:
        return "{} {} {}".format(self.op, self.arg1, self.arg2)

    def __repr__(self) -> str:
        return str(self)

    @classmethod
    def parse(cls, line: str) -> Instruction:
        split_line = line.split()
        if len(split_line) == 3:
            return Instruction(split_line[0], split_line[1], split_line[2])
        elif len(split_line) == 2:
            return Instruction(split_line[0], split_line[1])
        raise ValueError("Split line is too large")

    def arg1_is_register(self) -> bool:
        return not self.arg1.lstrip("-").isdigit()

    def arg2_is_register(self) -> bool:
        if self.arg2 is None:
            return False
        return not self.arg2.lstrip("-").isdigit()


class Computer:
    def __init__(self) -> None:
        self.registers: dict[str, int] = {}
        self.played_frequency: Optional[int] = None
        self.recovered_frequency: Optional[int] = None

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
        if instruction.op in ["set", "add", "mul", "mod", "jgz"]:
            if not instruction.arg2:
                raise ValueError(
                    "instruction {} with no 2nd argument".format(instruction.op)
                )
            return (
                self.registers[instruction.arg2]
                if instruction.arg2_is_register()
                else int(instruction.arg2)
            )
        else:
            return (
                self.registers[instruction.arg1]
                if instruction.arg1_is_register()
                else int(instruction.arg1)
            )

    def run(self, instructions: list[Instruction]) -> None:
        ins_index = 0
        while ins_index >= 0 and ins_index < len(instructions):
            instruction = instructions[ins_index]
            self.__init_registers(instruction)
            value: int = self.__get_value(instruction)

            if instruction.op == "snd":
                self.played_frequency = value
            elif instruction.op == "set":
                self.registers[instruction.arg1] = value
            elif instruction.op == "add":
                self.registers[instruction.arg1] += value
            elif instruction.op == "mul":
                self.registers[instruction.arg1] *= value
            elif instruction.op == "mod":
                self.registers[instruction.arg1] = (
                    self.registers[instruction.arg1] % value
                )
            elif instruction.op == "rcv" and self.registers[instruction.arg1] != 0:
                self.recovered_frequency = self.played_frequency
                return
            elif instruction.op == "jgz" and self.registers[instruction.arg1] > 0:
                ins_index += value - 1

            ins_index += 1


def find_recovered_frequency(lines: list[str]) -> int:
    instructions: list[Instruction] = list(map(Instruction.parse, lines))
    computer = Computer()
    computer.run(instructions)
    if computer.recovered_frequency is None:
        raise RuntimeError("No recovered frequency")
    return computer.recovered_frequency


class Program:
    def __init__(self, id: int, instructions: list[Instruction]) -> None:
        self.id = id
        self.instructions = instructions
        self.registers: dict[str, int] = {"p": id}
        self.other: Optional[Program] = None
        self.input: list[int] = []
        self.output: list[int] = []
        self.waiting = False
        self.ins_index = 0

    def __init_registers(self, instruction: Instruction) -> None:
        if instruction.arg1_is_register() and instruction.arg1 not in self.registers:
            self.registers[instruction.arg1] = 0
        if (
            instruction.arg2
            and instruction.arg2_is_register()
            and instruction.arg2 not in self.registers
        ):
            self.registers[instruction.arg2] = 0

    def run(self) -> None:
        if self.ins_index < 0 or self.ins_index > len(self.instructions):
            self.waiting = True
            return
        instruction = self.instructions[self.ins_index]
        self.__init_registers(instruction)
        if instruction.op == "snd":
            if instruction.arg1_is_register():
                self.output.append(self.registers[instruction.arg1])
            else:
                self.output.append(int(instruction.arg1))
        elif instruction.op == "rcv":
            if len(self.input) > 0:
                self.registers[instruction.arg1] = self.input.pop(0)
            else:
                self.waiting = True
                return
        else:
            arg1_value = (
                self.registers[instruction.arg1]
                if instruction.arg1_is_register()
                else int(instruction.arg1)
            )
            if not instruction.arg2:
                raise ValueError(
                    "instruction {} with no 2nd argument".format(instruction.op)
                )
            arg2_value = (
                self.registers[instruction.arg2]
                if instruction.arg2_is_register()
                else int(instruction.arg2)
            )

            if instruction.op == "set":
                self.registers[instruction.arg1] = arg2_value
            elif instruction.op == "add":
                self.registers[instruction.arg1] += arg2_value
            elif instruction.op == "mul":
                self.registers[instruction.arg1] *= arg2_value
            elif instruction.op == "mod":
                self.registers[instruction.arg1] = (
                    self.registers[instruction.arg1] % arg2_value
                )
            elif instruction.op == "jgz" and arg1_value > 0:
                self.ins_index += arg2_value
                return

        self.ins_index += 1


def run_concurrent_programs(lines: list[str]) -> int:
    instructions: list[Instruction] = list(map(Instruction.parse, lines))
    programs = (Program(0, instructions), Program(1, instructions))
    programs[0].other = programs[1]
    programs[1].other = programs[0]
    program_1_value_send_count = 0

    while not programs[0].waiting or not programs[1].waiting:
        for program in programs:
            if not program.waiting:
                program.run()
                if len(program.output) > 0 and program.other is not None:
                    sent_value = program.output.pop(0)
                    program.other.input.append(sent_value)
                    program.other.waiting = False
                    if program.id == 1:
                        program_1_value_send_count += 1

    return program_1_value_send_count
