from unittest import TestCase
from day14.day14 import total_load, total_load_after_cycles

class Day14Test(TestCase):
  def setUp(self) -> None:
    with open("day14/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day14/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_total_load(self) -> None:
    self.assertEqual(total_load(self.inputTestFile), 136)
    self.assertEqual(total_load(self.inputFile), 105208)

  def test_total_load_after_cycles(self) -> None:
    self.assertEqual(total_load_after_cycles(self.inputTestFile), 64)
    # self.assertEqual(total_load_after_cycles(self.inputFile), 102943)
