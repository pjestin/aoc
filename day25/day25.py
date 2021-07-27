from __future__ import annotations
import re
from typing import Optional

BEGIN_STATE_PATTERN = "Begin in state (\w)"
CHECKSUM_STEPS_PATTERN = "Perform a diagnostic checksum after (\d*) steps."
CURRENT_STATE_PATTERN = "In state (\w):"
CURRENT_VALUE_PATTERN = "  If the current value is (\d*):"
WRITE_VALUE_PATTERN = "    - Write the value (\d*)."
CHANGE_STATE_PATTERN = "    - Continue with state (\w)."
MOVE_PATTERN = "    - Move one slot to the (\w*)."


class Instruction:
    def __init__(self) -> None:
        raise Exception("Abstract class")


class WriteInstruction(Instruction):
    def __init__(self, value: int) -> None:
        self.value = value


class ChangeStateInstruction(Instruction):
    def __init__(self, state: str) -> None:
        self.state = state


class MoveInstruction(Instruction):
    def __init__(self, direction: int) -> None:
        self.direction = direction


class StateInstructions:
    def __init__(self) -> None:
        self.instructions: dict[int, list[Instruction]] = {}


class Program:
    def __init__(self, checksum_steps: int, state: str) -> None:
        self.checksum_steps = checksum_steps
        self.state = state
        self.state_instructions: dict[str, StateInstructions] = {}
        self.tape: dict[int, int] = {}
        self.position = 0

    @classmethod
    def parse(cls, lines: list[str]) -> Program:
        begin_state_match = re.match(BEGIN_STATE_PATTERN, lines[0])
        if not begin_state_match:
            raise Exception("First line not as expected")
        begin_state = begin_state_match.group(1)
        checksum_steps_match = re.match(CHECKSUM_STEPS_PATTERN, lines[1])
        if not checksum_steps_match:
            raise Exception("Second line not as expected")
        checksum_steps = int(checksum_steps_match.group(1))
        program = Program(checksum_steps, begin_state)

        current_state: Optional[str] = None
        current_value: Optional[int] = None

        for line in lines[2:]:
            if len(line) == 0:
                continue

            current_state_match = re.match(CURRENT_STATE_PATTERN, line)
            if current_state_match:
                current_state = current_state_match.group(1)
                if current_state not in program.state_instructions:
                    program.state_instructions[current_state] = StateInstructions()
                continue

            current_value_match = re.match(CURRENT_VALUE_PATTERN, line)
            if current_value_match:
                current_value = int(current_value_match.group(1))
                if current_state is None:
                    raise Exception("Unknown current state")
                if (
                    current_value
                    not in program.state_instructions[current_state].instructions
                ):
                    program.state_instructions[current_state].instructions[
                        current_value
                    ] = []
                continue

            if current_state is None:
                raise Exception("Unknown current state")
            if current_value is None:
                raise Exception("Unknown current value")

            write_value_match = re.match(WRITE_VALUE_PATTERN, line)
            if write_value_match:
                value = int(write_value_match.group(1))
                program.state_instructions[current_state].instructions[
                    current_value
                ].append(WriteInstruction(value))
                continue

            change_state_match = re.match(CHANGE_STATE_PATTERN, line)
            if change_state_match:
                state = change_state_match.group(1)
                program.state_instructions[current_state].instructions[
                    current_value
                ].append(ChangeStateInstruction(state))
                continue

            move_match = re.match(MOVE_PATTERN, line)
            if move_match:
                direction_word = move_match.group(1)
                direction = 1 if direction_word == "right" else -1
                program.state_instructions[current_state].instructions[
                    current_value
                ].append(MoveInstruction(direction))
                continue

            raise Exception("Unknown line: {}".format(line))

        return program

    def checksum(self) -> int:
        return sum(self.tape.values())

    def run(self) -> int:
        for _ in range(self.checksum_steps):
            if self.state not in self.state_instructions:
                raise Exception("State does not have instructions")
            state_instructions: StateInstructions = self.state_instructions[self.state]

            if self.position not in self.tape:
                self.tape[self.position] = 0
            current_value = self.tape[self.position]

            if current_value not in state_instructions.instructions:
                raise Exception("Value does not have instructions")
            instructions: list[Instruction] = state_instructions.instructions[
                current_value
            ]

            for instruction in instructions:
                if isinstance(instruction, WriteInstruction):
                    self.tape[self.position] = instruction.value
                elif isinstance(instruction, ChangeStateInstruction):
                    self.state = instruction.state
                elif isinstance(instruction, MoveInstruction):
                    self.position += instruction.direction

        return self.checksum()


def find_diagnostic_checksum(lines: list[str]) -> int:
    program: Program = Program.parse(lines)
    return program.run()
