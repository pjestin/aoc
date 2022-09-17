from unittest import TestCase
from day22.day22 import count_burst_infections, count_burst_infections_multistate


class Day22Test(TestCase):
    def setUp(self) -> None:
        with open("day22/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day22/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_count_burst_infections(self) -> None:
        self.assertEqual(5, count_burst_infections(self.inputTestFile, 7))
        self.assertEqual(41, count_burst_infections(self.inputTestFile, 70))
        self.assertEqual(5587, count_burst_infections(self.inputTestFile, 10_000))
        self.assertEqual(5447, count_burst_infections(self.inputFile, 10_000))

    def test_count_burst_infections_multistate(self) -> None:
        self.assertEqual(26, count_burst_infections_multistate(self.inputTestFile, 100))
        self.assertEqual(
            2511705, count_burst_infections_multistate(self.inputFile, 10_000_000)
        )
