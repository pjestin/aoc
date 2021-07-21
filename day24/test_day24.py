from unittest import TestCase
from day24.day24 import find_strongest_bridge, find_longest_bridge_strength


class Day24Test(TestCase):
    def setUp(self) -> None:
        with open("day24/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day24/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_strongest_bridge(self) -> None:
        self.assertEqual(31, find_strongest_bridge(self.inputTestFile))
        self.assertEqual(1695, find_strongest_bridge(self.inputFile))

    def test_find_longest_bridge_strength(self) -> None:
        self.assertEqual(19, find_longest_bridge_strength(self.inputTestFile))
        self.assertEqual(1673, find_longest_bridge_strength(self.inputFile))
