NUMBER_OF_INSERTIONS = 2017
NUMBER_OF_ANGRY_INSERTIONS = 50_000_000


def find_insertion_result(steps: int) -> int:
    lst = [0]
    position = 0
    for value in range(1, NUMBER_OF_INSERTIONS + 1):
        position = (position + steps) % len(lst)
        lst = lst[: position + 1] + [value] + lst[position + 1 :]
        position += 1
    return lst[position + 1]


def find_angry_insertion_result(steps: int) -> int:
    index = 0
    second_value = 0
    for value in range(1, NUMBER_OF_ANGRY_INSERTIONS + 1):
        index = 1 + (index + steps) % value
        if index == 1:
            second_value = value
    return second_value
