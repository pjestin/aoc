from day10.day10 import knot_hash
from lib.vector import Vector

ROW_NUMBER = 128
DIRECTIONS: list[Vector] = [Vector(1, 0), Vector(-1, 0), Vector(0, 1), Vector(0, -1)]


def __to_binary(hex: str) -> list[int]:
    binary_string: str = "{0:0{1}b}".format(int(hex, 16), 4)
    return list(map(int, binary_string))


def __get_bit_row(row_index: int, key: str) -> list[int]:
    hash: str = knot_hash("{}-{}".format(key, row_index))
    bit_row: list[int] = []
    for hex_char in hash:
        binary: list[int] = __to_binary(hex_char)
        bit_row.extend(binary)
    return bit_row


def __get_memory(key: str) -> list[list[int]]:
    row_indices: range = range(ROW_NUMBER)
    return list(map(lambda index: __get_bit_row(index, key), row_indices))


def count_used_memory(key: str) -> int:
    memory: list[list[int]] = __get_memory(key)
    bit_count = sum(sum(memory_row) for memory_row in memory)
    return bit_count


def __explore_region(
    memory: list[list[int]], visited: set[Vector], start: Vector
) -> None:
    queue: list[Vector] = [start]
    while len(queue) > 0:
        position: Vector = queue.pop(0)
        if (
            position in visited
            or position.x < 0
            or position.x >= len(memory)
            or position.y < 0
            or position.y >= len(memory[0])
            or memory[position.x][position.y] != 1
        ):
            continue
        visited.add(position)
        for direction in DIRECTIONS:
            queue.append(Vector(position.x, position.y) + direction)


def count_regions(key: str) -> int:
    memory: list[list[int]] = __get_memory(key)
    visited: set[Vector] = set()
    region_count = 0
    for row_index, memory_row in enumerate(memory):
        for column_index, bit in enumerate(memory_row):
            position = Vector(row_index, column_index)
            if position in visited or bit != 1:
                continue
            __explore_region(memory, visited, position)
            region_count += 1
    return region_count
