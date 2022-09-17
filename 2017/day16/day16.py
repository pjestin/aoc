from __future__ import annotations
from typing import Union


class DanceMove:
    def __init__(self, type: str, arg1: Union[int, str], arg2: Union[int, str, None]):
        self.type = type
        self.arg1 = arg1
        self.arg2 = arg2

    @classmethod
    def parse_from_line(cls, line: str) -> list[DanceMove]:
        moves: list[DanceMove] = []
        for move_string in line.split(","):
            move_type: str = move_string[0]
            split_around_slash = move_string[1:].split("/")
            if move_type == "s":
                moves.append(cls("s", int(move_string[1:]), None))
            elif move_type == "x":
                arg1X: int = int(split_around_slash[0])
                arg2X: int = int(split_around_slash[1])
                moves.append(cls("x", arg1X, arg2X))
            elif move_type == "p":
                arg1P: str = split_around_slash[0]
                arg2P: str = split_around_slash[1]
                moves.append(cls("p", arg1P, arg2P))
        return moves

    def apply(self, programs: list[str]) -> None:
        if self.type == "s":
            if not isinstance(self.arg1, int):
                raise Exception("Expected an int")
            programs_copy: list[str] = [program for program in programs]
            for index in range(len(programs)):
                programs[index] = programs_copy[(index - self.arg1) % len(programs)]
        elif self.type == "x":
            if not isinstance(self.arg1, int) or not isinstance(self.arg2, int):
                raise Exception("Expected ints")
            programs[self.arg1], programs[self.arg2] = (
                programs[self.arg2],
                programs[self.arg1],
            )
        elif self.type == "p":
            if not isinstance(self.arg1, str) or not isinstance(self.arg2, str):
                raise Exception("Expected strs")
            program_index_1 = programs.index(self.arg1)
            program_index_2 = programs.index(self.arg2)
            programs[program_index_1], programs[program_index_2] = (
                programs[program_index_2],
                programs[program_index_1],
            )


def program_dance(line: str, number_of_programs: int, repeat: int = 1) -> str:
    moves: list[DanceMove] = DanceMove.parse_from_line(line)
    programs: list[str] = [
        chr(i) for i in range(ord("a"), ord("a") + number_of_programs)
    ]
    visited: dict[str, int] = {}
    repeat_index = 0
    while repeat_index < repeat:
        for move in moves:
            move.apply(programs)
        programs_string = "".join(programs)
        if programs_string in visited:
            cycle_length: int = repeat_index - visited[programs_string]
            cycles_to_jump: int = (repeat - repeat_index) // cycle_length
            repeat_index += cycles_to_jump * cycle_length
        else:
            visited[programs_string] = repeat_index
        repeat_index += 1
    return "".join(programs)
