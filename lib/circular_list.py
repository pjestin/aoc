from typing import Union


class CircularList:
    def __init__(self, lst: list[int]):
        self.lst = lst
        self.size = len(lst)

    def __setitem__(self, key: Union[int, slice], value: Union[int, list[int]]) -> None:
        if isinstance(key, slice):
            assert isinstance(value, list)
            indices: list[int] = list(range(key.start, key.stop, key.step or 1))
            assert len(indices) == len(value)
            for value_index, index in enumerate(indices):
                self.lst[index % self.size] = value[value_index]
        elif isinstance(key, int):
            self.lst[key % self.size] = value
        else:
            raise TypeError("Argument {} is not of type int or slice".format(key))

    def __getitem__(self, key: Union[int, slice]) -> Union[int, list[int]]:
        if isinstance(key, slice):
            indices: list[int] = list(range(key.start, key.stop, key.step or 1))
            return [self.lst[index % self.size] for index in indices]
        elif isinstance(key, int):
            return self.lst[key % self.size]
        else:
            raise TypeError("Argument {} is not of type int or slice".format(key))

    def __delitem__(self, key: Union[int, slice]) -> None:
        if isinstance(key, slice):
            indices: list[int] = list(range(key.start, key.stop, key.step or 1))
            for index in indices:
                self.lst[index % self.size] = None
            self.lst = list(filter(lambda number: number != None, self.lst))
        elif isinstance(key, int):
            del self.lst[key % self.size]
        else:
            raise TypeError("Argument {} is not of type int or slice".format(key))

    def __len__(self) -> int:
        return self.size

    def __repr__(self) -> str:
        return str(self.lst)

    def __str__(self) -> str:
        return str(self.lst)

    def __eq__(self, o: object) -> bool:
        return self.lst == o.lst

    def reverse_sublist(self, key: slice) -> None:
        indices: list[int] = list(range(key.start, key.stop, key.step or 1))
        slice_length = len(indices)
        for value_index in range(slice_length // 2):
            tmp: int = self.lst[indices[value_index] % self.size]
            self.lst[indices[value_index] % self.size] = self.lst[
                indices[slice_length - value_index - 1] % self.size
            ]
            self.lst[indices[slice_length - value_index - 1] % self.size] = tmp
