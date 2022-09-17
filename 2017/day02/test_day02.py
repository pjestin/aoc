from unittest import TestCase
from day02.day02 import (
    find_checksum_by_smallest_largest,
    find_checksum_by_evenly_divisible,
)


class Day02Test(TestCase):
    def setUp(self) -> None:
        with open("day02/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day02/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()
        with open("day02/input-test-2.txt", "r") as file:
            self.inputTest2File = file.read().splitlines()

    def test_find_checksum_by_smallest_largest(self) -> None:
        self.assertEqual(18, find_checksum_by_smallest_largest(self.inputTestFile))
        self.assertEqual(32121, find_checksum_by_smallest_largest(self.inputFile))

    def test_find_checksum_by_evenly_divisible(self) -> None:
        self.assertEqual(9, find_checksum_by_evenly_divisible(self.inputTest2File))
        self.assertEqual(197, find_checksum_by_evenly_divisible(self.inputFile))
