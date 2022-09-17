from unittest import TestCase
from day18.day18 import find_recovered_frequency, run_concurrent_programs


class Day18Test(TestCase):
    def setUp(self) -> None:
        with open("day18/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day18/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()
        with open("day18/input-test-2.txt", "r") as file:
            self.inputTest2File = file.read().splitlines()

    def test_find_recovered_frequency(self) -> None:
        self.assertEqual(4, find_recovered_frequency(self.inputTestFile))
        self.assertEqual(1187, find_recovered_frequency(self.inputFile))

    def test_run_concurrent_programs(self) -> None:
        self.assertEqual(3, run_concurrent_programs(self.inputTest2File))
        self.assertEqual(5969, run_concurrent_programs(self.inputFile))
