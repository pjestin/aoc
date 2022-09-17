from unittest import TestCase
from day12.day12 import count_programs, count_groups


class Day12Test(TestCase):
    def setUp(self) -> None:
        with open("day12/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day12/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_count_programs(self) -> None:
        self.assertEqual(6, count_programs(self.inputTestFile))
        self.assertEqual(306, count_programs(self.inputFile))

    def test_count_groups(self) -> None:
        self.assertEqual(2, count_groups(self.inputTestFile))
        self.assertEqual(200, count_groups(self.inputFile))
