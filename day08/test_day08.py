from unittest import TestCase
from day08.day08 import execute_and_find_largest_value, find_highest_held_value


class Day08Test(TestCase):
    def setUp(self) -> None:
        with open("day08/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day08/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_execute_and_find_largest_value(self) -> None:
        self.assertEqual(1, execute_and_find_largest_value(self.inputTestFile))
        self.assertEqual(4066, execute_and_find_largest_value(self.inputFile))
    
    def test_find_highest_held_value(self) -> None:
        self.assertEqual(10, find_highest_held_value(self.inputTestFile))
        self.assertEqual(4829, find_highest_held_value(self.inputFile))
