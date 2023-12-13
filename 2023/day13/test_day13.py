from unittest import TestCase
from day13.day13 import summarize_symmetries

class Day13Test(TestCase):
  def setUp(self) -> None:
    with open("day13/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day13/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_summarize_symmetries(self) -> None:
    self.assertEqual(summarize_symmetries(self.inputTestFile), 405)
    self.assertEqual(summarize_symmetries(self.inputFile), 36448)
