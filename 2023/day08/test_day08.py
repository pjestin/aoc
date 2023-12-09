from unittest import TestCase
from day08.day08 import count_steps, count_steps_ghost

class Day08Test(TestCase):
  def setUp(self) -> None:
    with open("day08/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day08/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()
    with open("day08/input-test-2.txt", "r") as file:
      self.inputTest2File = file.read().splitlines()

  def test_count_steps(self) -> None:
    self.assertEqual(count_steps(self.inputTestFile), 6)
    self.assertEqual(count_steps(self.inputFile), 20569)

  def test_count_steps_ghost(self) -> None:
    self.assertEqual(count_steps_ghost(self.inputTest2File), 6)
    self.assertEqual(count_steps_ghost(self.inputFile), 21_366_921_060_721)
