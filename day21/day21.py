from __future__ import annotations
import math


STARTING_SQUARE_PATTERN = ".#./..#/###"


class Square:
    rule_cache: dict[str, str] = {}

    def __init__(self, pixels: list[list[bool]]) -> None:
        self.pixels = pixels
        self.size = len(pixels)

    @classmethod
    def from_pattern(cls, pattern: str) -> Square:
        square = Square([])
        square.pixels = list(
            map(
                lambda row: list(map(lambda pixel: pixel == "#", list(row))),
                pattern.split("/"),
            )
        )
        square.size = len(square.pixels)
        return square

    def copy(self) -> Square:
        return self.from_pattern(str(self))

    def __str__(self) -> str:
        return "/".join(
            map(
                lambda row: "".join(map(lambda pixel: "#" if pixel else ".", row)),
                self.pixels,
            )
        )

    def __repr__(self) -> str:
        return str(self)

    def __eq__(self, o: object) -> bool:
        return isinstance(o, Square) and str(self) == str(o)

    def rotate(self) -> None:
        for row in range((self.size + 1) // 2):
            for column in range(self.size // 2):
                tmp = self.pixels[row][column]
                self.pixels[row][column] = self.pixels[column][self.size - 1 - row]
                self.pixels[column][self.size - 1 - row] = self.pixels[
                    self.size - 1 - row
                ][self.size - 1 - column]
                self.pixels[self.size - 1 - row][self.size - 1 - column] = self.pixels[
                    self.size - 1 - column
                ][row]
                self.pixels[self.size - 1 - column][row] = tmp

    def flip(self) -> None:
        for row in range(self.size // 2):
            for column in range(self.size):
                tmp = self.pixels[row][column]
                self.pixels[row][column] = self.pixels[self.size - 1 - row][column]
                self.pixels[self.size - 1 - row][column] = tmp

    def is_equivalent(self, o: Square) -> bool:
        self_copy = self.copy()
        if self_copy == o:
            return True
        for _ in range(3):
            self_copy.rotate()
            if self_copy == o:
                return True
        self_copy.flip()
        if self_copy == o:
            return True
        for _ in range(3):
            self_copy.rotate()
            if self_copy == o:
                return True
        return False

    def __split_by_step(self, step: int) -> list[Square]:
        sub_squares: list[Square] = []
        for row in range(0, self.size, step):
            for column in range(0, self.size, step):
                sub_squares_split_by_row = self.pixels[row : row + step]
                sub_square_pixels = list(
                    map(
                        lambda row: row[column : column + step],
                        sub_squares_split_by_row,
                    )
                )
                sub_squares.append(Square(sub_square_pixels))
        return sub_squares

    def __split(self) -> list[Square]:
        if self.size % 2 == 0:
            return self.__split_by_step(2)
        elif self.size % 3 == 0:
            return self.__split_by_step(3)
        raise RuntimeError("Impossible to split square")

    def __transform(self, rules: list[Rule]) -> Square:
        pattern = str(self)
        if pattern in self.rule_cache:
            return self.from_pattern(self.rule_cache[pattern])
        for rule in rules:
            if self.is_equivalent(rule.start):
                self.rule_cache[pattern] = str(rule.end)
                return rule.end
        raise RuntimeError("No rule applies to {}".format(self))

    @classmethod
    def __combine(cls, sub_squares: list[Square]) -> Square:
        sub_square_size: int = sub_squares[0].size
        nb_sub_square_per_side: int = math.isqrt(len(sub_squares))
        size: int = sub_square_size * nb_sub_square_per_side
        pixels: list[list[bool]] = [[False for _ in range(size)] for _ in range(size)]

        for big_row in range(nb_sub_square_per_side):
            for big_column in range(nb_sub_square_per_side):
                sub_square = sub_squares[nb_sub_square_per_side * big_row + big_column]
                for small_row in range(sub_square_size):
                    for small_column in range(sub_square_size):
                        pixels[sub_square_size * big_row + small_row][
                            sub_square_size * big_column + small_column
                        ] = sub_square.pixels[small_row][small_column]

        return cls(pixels)

    def enhance(self, rules: list[Rule]) -> None:
        sub_squares: list[Square] = self.__split()
        transformed_sub_squares: list[Square] = list(
            map(lambda s: s.__transform(rules), sub_squares)
        )
        combined: Square = self.__combine(transformed_sub_squares)
        self.pixels = combined.pixels
        self.size = combined.size

    def count_pixels(self) -> int:
        return sum(sum(1 if pixel else 0 for pixel in row) for row in self.pixels)


class Rule:
    def __init__(self, start: Square, end: Square) -> None:
        self.start = start
        self.end = end

    @classmethod
    def parse(cls, line: str) -> Rule:
        split_line = line.split(" => ")
        return Rule(
            Square.from_pattern(split_line[0]), Square.from_pattern(split_line[1])
        )


def count_pixels_after_transformations(lines: list[str], nb_iterations: int) -> int:
    Square.rule_cache = {}
    rules: list[Rule] = list(map(Rule.parse, lines))
    square = Square.from_pattern(STARTING_SQUARE_PATTERN)
    for _ in range(nb_iterations):
        square.enhance(rules)
    return square.count_pixels()
