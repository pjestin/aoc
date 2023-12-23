from unittest import TestCase
from day16.day16 import count_energized, count_max_energized

class Day16Test(TestCase):
  def setUp(self) -> None:
    with open("day16/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day16/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_count_energized(self) -> None:
    self.assertEqual(count_energized(self.inputTestFile), 46)
    self.assertEqual(count_energized(self.inputFile), 6514)

  def test_count_max_energized(self) -> None:
    self.assertEqual(count_max_energized(self.inputTestFile), 51)
    self.assertEqual(count_max_energized(self.inputFile), 8089)
