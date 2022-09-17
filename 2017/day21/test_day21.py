from unittest import TestCase
from day21.day21 import count_pixels_after_transformations


class Day21Test(TestCase):
    def setUp(self) -> None:
        with open("day21/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day21/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_count_pixels_after_transformations(self) -> None:
        self.assertEqual(12, count_pixels_after_transformations(self.inputTestFile, 2))
        self.assertEqual(117, count_pixels_after_transformations(self.inputFile, 5))
        self.assertEqual(
            2026963, count_pixels_after_transformations(self.inputFile, 18)
        )
