from unittest import TestCase
from day17.day17 import find_insertion_result, find_angry_insertion_result


class Day17Test(TestCase):
    def test_find_insertion_result(self) -> None:
        self.assertEqual(638, find_insertion_result(3))
        self.assertEqual(808, find_insertion_result(356))

    def test_find_angry_insertion_result(self) -> None:
        self.assertEqual(1222153, find_angry_insertion_result(3))
        self.assertEqual(47465686, find_angry_insertion_result(356))
