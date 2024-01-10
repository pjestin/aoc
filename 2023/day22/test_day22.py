from unittest import TestCase
from day22.day22 import count_disintegratable_bricks, sum_other_bricks_fall

class Day22Test(TestCase):
  def setUp(self) -> None:
    with open("day22/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day22/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_count_disintegratable_bricks(self) -> None:
    self.assertEqual(count_disintegratable_bricks(self.inputTestFile), 5)
    self.assertEqual(count_disintegratable_bricks(self.inputFile), 416)

  def test_sum_other_bricks_fall(self) -> None:
    self.assertEqual(sum_other_bricks_fall(self.inputTestFile), 7)
    self.assertEqual(sum_other_bricks_fall(self.inputFile), 60963)
