from unittest import TestCase
from day17.day17 import find_insertion_result


class Day17Test(TestCase):
    def test_find_insertion_result(self) -> None:
        self.assertEqual(638, find_insertion_result(3))
        self.assertEqual(808, find_insertion_result(356))
