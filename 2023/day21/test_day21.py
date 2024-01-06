from unittest import TestCase
from day21.day21 import count_garden_plots, extrapolate_large_garden_plots

class Day21Test(TestCase):
  def setUp(self) -> None:
    with open("day21/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day21/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_count_garden_plots(self) -> None:
    self.assertEqual(count_garden_plots(self.inputTestFile, 6), 16)
    self.assertEqual(count_garden_plots(self.inputTestFile, 10), 50)
    self.assertEqual(count_garden_plots(self.inputTestFile, 50), 1594)
    self.assertEqual(count_garden_plots(self.inputTestFile, 100), 6536)
    self.assertEqual(count_garden_plots(self.inputFile, 64), 3615)

  def test_extrapolate_large_garden_plots(self) -> None:
    self.assertEqual(extrapolate_large_garden_plots(self.inputFile, 26501365), 602259568764234)
