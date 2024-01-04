from unittest import TestCase
from day21.day21 import count_garden_plots

class Day21Test(TestCase):
  def setUp(self) -> None:
    with open("day21/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day21/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_count_garden_plots(self) -> None:
    self.assertEqual(count_garden_plots(self.inputTestFile, 6), 16)
    self.assertEqual(count_garden_plots(self.inputFile, 64), 3615)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 10), 50)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 50), 1594)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 100), 6536)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 500), 167004)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 1000), 668697)
    # self.assertEqual(count_garden_plots(self.inputTestFile, 5000), 26501365)
    # self.assertEqual(count_garden_plots(self.inputFile, 26501365), 3615)
