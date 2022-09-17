from unittest import TestCase
from day01.day01 import sum_next_matching_digits, sum_halfway_matching_digits


class Day01Test(TestCase):
    def setUp(self) -> None:
        with open("day01/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day01/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()
        with open("day01/input-test-2.txt", "r") as file:
            self.inputTest2File = file.read().splitlines()

    def test_sum_next_matching_digits(self) -> None:
        self.assertEqual(3, sum_next_matching_digits(self.inputTestFile[0]))
        self.assertEqual(9, sum_next_matching_digits(self.inputTest2File[0]))
        self.assertEqual(1341, sum_next_matching_digits(self.inputFile[0]))

    def test_sum_halfway_matching_digits(self) -> None:
        self.assertEqual(0, sum_halfway_matching_digits(self.inputTestFile[0]))
        self.assertEqual(6, sum_halfway_matching_digits(self.inputTest2File[0]))
        self.assertEqual(1348, sum_halfway_matching_digits(self.inputFile[0]))
