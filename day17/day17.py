NUMBER_OF_INSERTIONS = 2017


def find_insertion_result(steps: int) -> int:
    lst = [0]
    position = 0
    for value in range(1, NUMBER_OF_INSERTIONS + 1):
        position = (position + steps) % len(lst)
        lst = lst[: position + 1] + [value] + lst[position + 1 :]
        position += 1
    return lst[position + 1]
