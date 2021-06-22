from lib.circular_list import CircularList


DEFAULT_LIST_SIZE = 256
PROCESS_ITERATIONS = 64
ADDITIONAL_LENGTHS = [17, 31, 73, 47, 23]
BLOCK_SIZE = 16


def process_list(line: str, list_size: int = DEFAULT_LIST_SIZE) -> int:
    lengths: list[int] = list(map(int, line.split(",")))
    numbers: CircularList = CircularList(list(range(list_size)))
    current_position = 0
    skip_size = 0
    for length in lengths:
        numbers.reverse_sublist(slice(current_position, current_position + length))
        current_position += length + skip_size
        skip_size += 1
    return numbers[0] * numbers[1]


def __dense_hash_list(numbers: CircularList) -> list[int]:
    hash_list: list[int] = []
    for block_index in range(DEFAULT_LIST_SIZE // BLOCK_SIZE):
        current = 0
        for index in range(BLOCK_SIZE):
            current = current ^ numbers[block_index * BLOCK_SIZE + index]
        hash_list.append(current)
    return hash_list


def __to_hex(hash_number: int) -> str:
    return "{0:0{1}x}".format(hash_number, 2)


def knot_hash(line: str) -> str:
    lengths: list[int] = list(map(ord, list(line))) + ADDITIONAL_LENGTHS
    numbers: CircularList = CircularList(list(range(DEFAULT_LIST_SIZE)))
    current_position = 0
    skip_size = 0
    for _ in range(PROCESS_ITERATIONS):
        for length in lengths:
            numbers.reverse_sublist(slice(current_position, current_position + length))
            current_position += length + skip_size
            skip_size += 1
    dense_hash_list: list[int] = __dense_hash_list(numbers)
    return "".join(map(__to_hex, dense_hash_list))
