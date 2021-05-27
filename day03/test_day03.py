from unittest import TestCase
from day03.day03 import find_spiral_pattern_steps, find_stress_test_large_value


class Day03Test(TestCase):
    def test_find_spiral_pattern_steps(self) -> None:
        self.assertEqual(2, find_spiral_pattern_steps(23))
        self.assertEqual(31, find_spiral_pattern_steps(1024))
        self.assertEqual(430, find_spiral_pattern_steps(312051))

    def test_find_stress_test_large_value(self) -> None:
        self.assertEqual(25, find_stress_test_large_value(23))
        self.assertEqual(312453, find_stress_test_large_value(312051))
