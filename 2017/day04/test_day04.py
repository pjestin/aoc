from unittest import TestCase
from day04.day04 import count_valid_passphrases, count_valid_passphrases_with_anagrams


class Day04Test(TestCase):
    def setUp(self) -> None:
        with open("day04/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()

    def test_count_valid_passphrases(self) -> None:
        self.assertEqual(455, count_valid_passphrases(self.inputFile))

    def test_count_valid_passphrases_with_anagrams(self) -> None:
        self.assertEqual(186, count_valid_passphrases_with_anagrams(self.inputFile))
