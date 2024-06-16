from unittest import TestCase
from day25.day25 import cut_three_wires

class Day25Test(TestCase):
  def setUp(self) -> None:
    with open("day25/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day25/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_cut_three_wires(self) -> None:
    self.assertEqual(cut_three_wires(self.inputTestFile), 54)
    self.assertEqual(cut_three_wires(self.inputFile), 606062)
