from unittest import TestCase
from day11.day11 import hex_distance, max_hex_distance


class Day11Test(TestCase):
    def setUp(self) -> None:
        with open("day11/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day11/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_hex_distance(self) -> None:
        self.assertEqual(3, hex_distance(self.inputTestFile[0]))
        self.assertEqual(0, hex_distance(self.inputTestFile[1]))
        self.assertEqual(2, hex_distance(self.inputTestFile[2]))
        self.assertEqual(3, hex_distance(self.inputTestFile[3]))
        self.assertEqual(818, hex_distance(self.inputFile[0]))

    def test_max_hex_distance(self) -> None:
        self.assertEqual(3, max_hex_distance(self.inputTestFile[0]))
        self.assertEqual(2, max_hex_distance(self.inputTestFile[1]))
        self.assertEqual(2, max_hex_distance(self.inputTestFile[2]))
        self.assertEqual(3, max_hex_distance(self.inputTestFile[3]))
        self.assertEqual(1596, max_hex_distance(self.inputFile[0]))
