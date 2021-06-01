from unittest import TestCase
from day07.day07 import find_bottom_program, find_correct_weight


class Day07Test(TestCase):
    def setUp(self) -> None:
        with open("day07/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day07/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_bottom_program(self) -> None:
        self.assertEqual("tknk", find_bottom_program(self.inputTestFile))
        self.assertEqual("gmcrj", find_bottom_program(self.inputFile))

    def test_find_correct_weight(self) -> None:
        self.assertEqual(60, find_correct_weight(self.inputTestFile))
        self.assertEqual("gmcrj", find_correct_weight(self.inputFile))  # 65877
