from unittest import TestCase
from day25.day25 import find_diagnostic_checksum


class Day25Test(TestCase):
    def setUp(self) -> None:
        with open("day25/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day25/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_diagnostic_checksum(self) -> None:
        self.assertEqual(3, find_diagnostic_checksum(self.inputTestFile))
        self.assertEqual(2725, find_diagnostic_checksum(self.inputFile))
