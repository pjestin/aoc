from unittest import TestCase
from day12.day12 import sum_possibilities

class Day12Test(TestCase):
  def setUp(self) -> None:
    with open("day12/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day12/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_possibilities(self) -> None:
   self.assertEqual(sum_possibilities(self.inputTestFile, 1), 21)
   self.assertEqual(sum_possibilities(self.inputFile, 1), 7792)
  #  self.assertEqual(sum_possibilities(self.inputTestFile, 5), 525152)
  #  self.assertEqual(sum_possibilities(self.inputFile, 5), 7792)
