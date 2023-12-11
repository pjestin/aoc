from unittest import TestCase
from day11.day11 import sum_closest_paths

class Day11Test(TestCase):
  def setUp(self) -> None:
    with open("day11/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day11/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_closest_paths(self) -> None:
    self.assertEqual(sum_closest_paths(self.inputTestFile, 2), 374)
    self.assertEqual(sum_closest_paths(self.inputFile, 2), 9724940)

  def test_sum_closest_paths_expand_factor(self) -> None:
    self.assertEqual(sum_closest_paths(self.inputTestFile, 10), 1030)
    self.assertEqual(sum_closest_paths(self.inputTestFile, 100), 8410)
    self.assertEqual(sum_closest_paths(self.inputFile, 1_000_000), 569052586852)
