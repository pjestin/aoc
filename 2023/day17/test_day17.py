from unittest import TestCase
from day17.day17 import find_min_heat_loss

class Day17Test(TestCase):
  def setUp(self) -> None:
    with open("day17/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day17/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()
    with open("day17/input-test-2.txt", "r") as file:
      self.inputTest2File = file.read().splitlines()

  def test_find_min_heat_loss(self) -> None:
    self.assertEqual(find_min_heat_loss(self.inputTestFile, False), 102)
    self.assertEqual(find_min_heat_loss(self.inputFile, False), 1128)
    self.assertEqual(find_min_heat_loss(self.inputTestFile, True), 94)
    self.assertEqual(find_min_heat_loss(self.inputTest2File, True), 71)
    self.assertEqual(find_min_heat_loss(self.inputFile, True), 1268)
