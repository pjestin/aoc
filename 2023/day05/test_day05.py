from unittest import TestCase
from day05.day05 import find_closest_seed, find_closest_seed_with_ranges

class Day05Test(TestCase):
  def setUp(self) -> None:
    with open("day05/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day05/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_find_closest_seed(self) -> None:
    self.assertEqual(find_closest_seed(self.inputTestFile), 35)
    self.assertEqual(find_closest_seed(self.inputFile), 331445006)

  def test_find_closest_seed_with_ranges(self) -> None:
    self.assertEqual(find_closest_seed_with_ranges(self.inputTestFile), 46)
    self.assertEqual(find_closest_seed_with_ranges(self.inputFile), 6472060)
