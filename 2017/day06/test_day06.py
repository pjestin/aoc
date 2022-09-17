from unittest import TestCase
from day06.day06 import find_redistribution_cycle, find_redistribution_cycle_length


class Day06Test(TestCase):
    def setUp(self) -> None:
        with open("day06/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day06/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_redistribution_cycle(self) -> None:
        self.assertEqual(5, find_redistribution_cycle(self.inputTestFile[0]))
        self.assertEqual(12841, find_redistribution_cycle(self.inputFile[0]))

    def test_find_redistribution_cycle_length(self) -> None:
        self.assertEqual(4, find_redistribution_cycle_length(self.inputTestFile[0]))
        self.assertEqual(8038, find_redistribution_cycle_length(self.inputFile[0]))
