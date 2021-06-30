from unittest import TestCase
from day15.day15 import count_matching_pairs, count_matching_pairs_picky


class Day15Test(TestCase):
    def setUp(self) -> None:
        with open("day15/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day15/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_count_matching_pairs(self) -> None:
        self.assertEqual(588, count_matching_pairs(self.inputTestFile))
        self.assertEqual(569, count_matching_pairs(self.inputFile))

    def test_count_matching_pairs_picky(self) -> None:
        self.assertEqual(309, count_matching_pairs_picky(self.inputTestFile))
        self.assertEqual(298, count_matching_pairs_picky(self.inputFile))
