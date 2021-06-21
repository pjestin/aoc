from unittest import TestCase
from day10.day10 import process_list, knot_hash


class Day10Test(TestCase):
    def setUp(self) -> None:
        with open("day10/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day10/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_process_list(self) -> None:
        self.assertEqual(12, process_list(self.inputTestFile[0], 5))
        self.assertEqual(1980, process_list(self.inputFile[0]))

    def test_knot_hash(self) -> None:
        self.assertEqual(
            "a2582a3a0e66e6e86e3812dcb672a272", knot_hash(self.inputTestFile[1])
        )
        self.assertEqual(
            "33efeb34ea91902bb2f59c9920caa6cd", knot_hash(self.inputTestFile[2])
        )
        self.assertEqual(
            "3efbe78a8d82f29979031a4aa0b16a9d", knot_hash(self.inputTestFile[3])
        )
        self.assertEqual(
            "63960835bcdc130f0b66d7ff4f6a5a8e", knot_hash(self.inputTestFile[4])
        )
        self.assertEqual(
            "899124dac21012ebc32e2f4d11eaec55", knot_hash(self.inputFile[0])
        )
