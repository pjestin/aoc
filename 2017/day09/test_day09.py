from unittest import TestCase
from day09.day09 import find_group_score, count_garbage


class Day09Test(TestCase):
    def setUp(self) -> None:
        with open("day09/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day09/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()

    def test_find_group_score(self) -> None:
        self.assertEqual(1, find_group_score(self.inputTestFile[0]))
        self.assertEqual(6, find_group_score(self.inputTestFile[1]))
        self.assertEqual(5, find_group_score(self.inputTestFile[2]))
        self.assertEqual(16, find_group_score(self.inputTestFile[3]))
        self.assertEqual(1, find_group_score(self.inputTestFile[4]))
        self.assertEqual(9, find_group_score(self.inputTestFile[5]))
        self.assertEqual(9, find_group_score(self.inputTestFile[6]))
        self.assertEqual(3, find_group_score(self.inputTestFile[7]))
        self.assertEqual(9662, find_group_score(self.inputFile[0]))

    def test_count_garbage(self) -> None:
        self.assertEqual(0, count_garbage(self.inputTestFile[0]))
        self.assertEqual(0, count_garbage(self.inputTestFile[1]))
        self.assertEqual(0, count_garbage(self.inputTestFile[2]))
        self.assertEqual(0, count_garbage(self.inputTestFile[3]))
        self.assertEqual(4, count_garbage(self.inputTestFile[4]))
        self.assertEqual(8, count_garbage(self.inputTestFile[5]))
        self.assertEqual(0, count_garbage(self.inputTestFile[6]))
        self.assertEqual(17, count_garbage(self.inputTestFile[7]))
        self.assertEqual(4903, count_garbage(self.inputFile[0]))
