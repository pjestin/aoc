from unittest import TestCase
from day19.day19 import find_path_order, find_path_steps


class Day19Test(TestCase):
    def setUp(self) -> None:
        with open("day19/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day19/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_path_order(self) -> None:
        self.assertEqual("ABCDEF", find_path_order(self.inputTestFile))
        self.assertEqual("AYRPVMEGQ", find_path_order(self.inputFile))

    def test_find_path_steps(self) -> None:
        self.assertEqual(38, find_path_steps(self.inputTestFile))
        self.assertEqual(16408, find_path_steps(self.inputFile))
