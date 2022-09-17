GENERATOR_A_FACTOR = 16807 # 7^5
GENERATOR_B_FACTOR = 48271 # 48271^1
QUOTIENT = 2147483647 # 2147483647^1
NUMBER_OF_PAIRS = 40_000_000
NUMBER_OF_PAIRS_PICKY = 5_000_000
BITS_TO_MATCH = 65535 # 2^16 - 1
GENERATOR_A_MULTIPLE = 4
GENERATOR_B_MULTIPLE = 8


class Generator:
    def __init__(self, start: int, factor: int, multiple: int = 1) -> None:
        self.value = start
        self.factor = factor
        self.multiple = multiple
    
    def generate(self) -> int:
        self.value = (self.value * self.factor) % QUOTIENT
        while self.value % self.multiple != 0:
            self.value = (self.value * self.factor) % QUOTIENT
        return self.value


def __parse_generator(lines: list[str]) -> tuple[Generator, Generator]:
    generator_a_start: int = int(lines[0].split("Generator A starts with ")[1])
    generator_a: Generator = Generator(generator_a_start, GENERATOR_A_FACTOR)
    generator_b_start: int = int(lines[1].split("Generator B starts with ")[1])
    generator_b: Generator = Generator(generator_b_start, GENERATOR_B_FACTOR)
    return (generator_a, generator_b)


def count_matching_pairs(lines: list[str]) -> int:
    generators: tuple[Generator, Generator] = __parse_generator(lines)
    matching_pairs = 0
    for _ in range(NUMBER_OF_PAIRS):
        values: tuple[int, int] = (generators[0].generate(), generators[1].generate())
        if values[0] & BITS_TO_MATCH == values[1] & BITS_TO_MATCH:
            matching_pairs += 1
    return matching_pairs


def __parse_generator_with_multiples(lines: list[str]) -> tuple[Generator, Generator]:
    generator_a_start: int = int(lines[0].split("Generator A starts with ")[1])
    generator_a: Generator = Generator(generator_a_start, GENERATOR_A_FACTOR, GENERATOR_A_MULTIPLE)
    generator_b_start: int = int(lines[1].split("Generator B starts with ")[1])
    generator_b: Generator = Generator(generator_b_start, GENERATOR_B_FACTOR, GENERATOR_B_MULTIPLE)
    return (generator_a, generator_b)


def count_matching_pairs_picky(lines: list[str]) -> int:
    generators: tuple[Generator, Generator] = __parse_generator_with_multiples(lines)
    matching_pairs = 0
    for _ in range(NUMBER_OF_PAIRS_PICKY):
        values: tuple[int, int] = (generators[0].generate(), generators[1].generate())
        if values[0] & BITS_TO_MATCH == values[1] & BITS_TO_MATCH:
            matching_pairs += 1
    return matching_pairs
