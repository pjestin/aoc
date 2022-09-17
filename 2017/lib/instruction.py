from __future__ import annotations
from typing import Optional


class Instruction:
    def __init__(self, op: str, arg1: str, arg2: Optional[str] = None) -> None:
        self.op = op
        self.arg1 = arg1
        self.arg2 = arg2

    def __str__(self) -> str:
        if self.arg2 is None:
            return "{} {}".format(self.op, self.arg1)
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
