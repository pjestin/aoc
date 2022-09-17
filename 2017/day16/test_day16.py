from unittest import TestCase
from day16.day16 import program_dance


class Day16Test(TestCase):
    def setUp(self) -> None:
        with open("day16/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day16/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_program_dance(self) -> None:
        self.assertEqual("baedc", program_dance(self.inputTestFile[0], 5))
        self.assertEqual("olgejankfhbmpidc", program_dance(self.inputFile[0], 16))

    def test_program_dance_repeat(self) -> None:
        self.assertEqual("ceadb", program_dance(self.inputTestFile[0], 5, 2))
        self.assertEqual("gfabehpdojkcimnl", program_dance(self.inputFile[0], 16, 10 ** 9))
