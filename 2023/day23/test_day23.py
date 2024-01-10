from unittest import TestCase
from day23.day23 import find_longest_path, find_longest_path_aggregated

class Day23Test(TestCase):
  def setUp(self) -> None:
    with open("day23/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day23/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_find_longest_path(self) -> None:
    self.assertEqual(find_longest_path(self.inputTestFile), 94)
    self.assertEqual(find_longest_path(self.inputFile), 2218)

  def test_find_longest_path_aggregated(self) -> None:
    self.assertEqual(find_longest_path_aggregated(self.inputTestFile), 154)
    # self.assertEqual(find_longest_path_aggregated(self.inputFile), 6674)
