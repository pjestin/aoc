from unittest import TestCase
from day01.day01 import sum_calibration_values, sum_calibration_str_digits


class Day01Test(TestCase):
  def setUp(self) -> None:
    with open("day01/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day01/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()
    with open("day01/input-test-2.txt", "r") as file:
      self.inputTest2File = file.read().splitlines()

  def test_sum_calibration_values(self) -> None:
    self.assertEqual(sum_calibration_values(self.inputTestFile), 142)
    self.assertEqual(sum_calibration_values(self.inputFile), 54630)
    
  def test_sum_calibration_str_digits(self) -> None:
    self.assertEqual(sum_calibration_str_digits(self.inputTest2File), 281)
    self.assertEqual(sum_calibration_str_digits(self.inputFile), 54770)
