from unittest import TestCase
from day05.day05 import (
    find_steps_before_exit,
    find_steps_before_exit_alternative_increment,
)


class Day05Test(TestCase):
    def setUp(self) -> None:
        with open("day05/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day05/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_steps_before_exit(self) -> None:
        self.assertEqual(5, find_steps_before_exit(self.inputTestFile))
        self.assertEqual(343467, find_steps_before_exit(self.inputFile))

    def test_find_steps_before_exit_alternative_increment(self) -> None:
        self.assertEqual(
            10, find_steps_before_exit_alternative_increment(self.inputTestFile)
        )
        self.assertEqual(
            24774780, find_steps_before_exit_alternative_increment(self.inputFile)
        )
