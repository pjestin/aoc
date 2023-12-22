from unittest import TestCase
from day15.day15 import sum_initialization_hashes, sum_focusing_power

class Day15Test(TestCase):
  def setUp(self) -> None:
    with open("day15/input.txt", "r") as file:
      self.inputLine = file.read().splitlines()[0]
    with open("day15/input-test.txt", "r") as file:
      self.inputTestLine = file.read().splitlines()[0]

  def test_sum_initialization_hashes(self) -> None:
    self.assertEqual(sum_initialization_hashes(self.inputTestLine), 1320)
    self.assertEqual(sum_initialization_hashes(self.inputLine), 506891)

  def test_sum_focusing_power(self) -> None:
    self.assertEqual(sum_focusing_power(self.inputTestLine), 145)
    self.assertEqual(sum_focusing_power(self.inputLine), 230462)
