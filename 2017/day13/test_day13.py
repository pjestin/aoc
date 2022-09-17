from unittest import TestCase
from day13.day13 import find_trip_severity, find_least_delay


class Day13Test(TestCase):
    def setUp(self) -> None:
        with open("day13/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day13/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_trip_severity(self) -> None:
        self.assertEqual(24, find_trip_severity(self.inputTestFile))
        self.assertEqual(2508, find_trip_severity(self.inputFile))

    def test_find_least_delay(self) -> None:
        self.assertEqual(10, find_least_delay(self.inputTestFile))
        self.assertEqual(3913186, find_least_delay(self.inputFile))
