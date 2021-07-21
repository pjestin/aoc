from unittest import TestCase
from day23.day23 import count_mul_in_program, count_non_primes_in_range


class Day23Test(TestCase):
    def setUp(self) -> None:
        with open("day23/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()

    def test_count_burst_infections(self) -> None:
        self.assertEqual(4225, count_mul_in_program(self.inputFile))

    def test_count_non_primes_in_range(self) -> None:
        self.assertEqual(73, count_non_primes_in_range(range(2, 100)))
        self.assertEqual(830, count_non_primes_in_range(range(2, 1000)))
        self.assertEqual(905, count_non_primes_in_range(range(106_700, 123_717, 17)))
