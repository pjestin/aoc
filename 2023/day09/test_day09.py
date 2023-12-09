from unittest import TestCase
from day09.day09 import sum_extrapolated, sum_extrapolated_backwards

class Day09Test(TestCase):
  def setUp(self) -> None:
    with open("day09/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day09/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_extrapolated(self) -> None:
    self.assertEqual(sum_extrapolated(self.inputTestFile), 114)
    self.assertEqual(sum_extrapolated(self.inputFile), 1_637_452_029)

  def test_sum_extrapolated_backwards(self) -> None:
    self.assertEqual(sum_extrapolated_backwards(self.inputTestFile), 2)
    self.assertEqual(sum_extrapolated_backwards(self.inputFile), 908)
