from unittest import TestCase
from day02.day02 import sum_possible_ids, sum_game_powers

class Day02Test(TestCase):
  def setUp(self) -> None:
    with open("day02/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day02/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_possible_ids(self) -> None:
    self.assertEqual(sum_possible_ids(self.inputTestFile), 8)
    self.assertEqual(sum_possible_ids(self.inputFile), 2207)

  def test_sum_game_powers(self) -> None:
    self.assertEqual(sum_game_powers(self.inputTestFile), 2286)
    self.assertEqual(sum_game_powers(self.inputFile), 62241)
