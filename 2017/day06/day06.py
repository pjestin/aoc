def __bank_hash(banks: list[int]) -> str:
    return ";".join(map(str, banks))


def __find_max_bank(banks: list[int]) -> tuple[int, int]:
    max_bank_index, max_bank_blocks = 0, 0
    for bank_index, blocks in enumerate(banks):
        if blocks > max_bank_blocks:
            max_bank_blocks = blocks
            max_bank_index = bank_index
    return max_bank_index, max_bank_blocks


def __redistribute(banks: list[int]) -> None:
    max_bank_index, blocks_to_redistribute = __find_max_bank(banks)
    banks[max_bank_index] = 0
    bank_index = max_bank_index + 1
    while blocks_to_redistribute > 0:
        banks[bank_index % len(banks)] += 1
        blocks_to_redistribute -= 1
        bank_index += 1


def find_redistribution_cycle(line: str) -> int:
    banks: list[int] = list(map(int, line.split()))
    visited_banks: set[str] = set()
    steps = 0
    while __bank_hash(banks) not in visited_banks:
        visited_banks.add(__bank_hash(banks))
        __redistribute(banks)
        steps += 1
    return steps


def find_redistribution_cycle_length(line: str) -> int:
    banks: list[int] = list(map(int, line.split()))
    visited_banks: dict[str, int] = {}
    steps = 0
    while __bank_hash(banks) not in visited_banks:
        visited_banks[__bank_hash(banks)] = steps
        __redistribute(banks)
        steps += 1
    return steps - visited_banks[__bank_hash(banks)]
