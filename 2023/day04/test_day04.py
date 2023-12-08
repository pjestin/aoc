from unittest import TestCase
from day04.day04 import sum_points, count_cards

class Day02Test(TestCase):
  def setUp(self) -> None:
    with open("day04/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day04/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_points(self) -> None:
    self.assertEqual(sum_points(self.inputTestFile), 13)
    self.assertEqual(sum_points(self.inputFile), 18653)

  def test_count_cards(self) -> None:
    self.assertEqual(count_cards(self.inputTestFile), 30)
    self.assertEqual(count_cards(self.inputFile), 5921508)
