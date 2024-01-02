from unittest import TestCase
from day18.day18 import find_lagoon_surface

class Day18Test(TestCase):
  def setUp(self) -> None:
    with open("day18/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day18/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_find_lagoon_surface(self) -> None:
    self.assertEqual(find_lagoon_surface(self.inputTestFile, False), 62)
    self.assertEqual(find_lagoon_surface(self.inputFile, False), 47139)
    self.assertEqual(find_lagoon_surface(self.inputTestFile, True), 952408144115)
    self.assertEqual(find_lagoon_surface(self.inputFile, True), 173152345887206)
