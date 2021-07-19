from unittest import TestCase
from day23.day23 import count_mul_in_program


class Day23Test(TestCase):
    def setUp(self) -> None:
        with open("day23/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()

    def test_count_burst_infections(self) -> None:
        self.assertEqual(4225, count_mul_in_program(self.inputFile))
