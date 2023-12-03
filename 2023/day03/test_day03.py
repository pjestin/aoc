from unittest import TestCase
from day03.day03 import sum_part_numbers


class Day02Test(TestCase):
  def setUp(self) -> None:
    with open("day03/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day03/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_part_numbers(self) -> None:
    self.assertEqual(sum_part_numbers(self.inputTestFile), 4361)
    self.assertEqual(sum_part_numbers(self.inputFile), 532331)
