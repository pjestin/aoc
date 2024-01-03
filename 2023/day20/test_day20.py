from unittest import TestCase
from day20.day20 import count_pulses

class Day20Test(TestCase):
  def setUp(self) -> None:
    with open("day20/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day20/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()
    with open("day20/input-test-2.txt", "r") as file:
      self.inputTest2File = file.read().splitlines()

  def test_count_pulses(self) -> None:
    self.assertEqual(count_pulses(self.inputTestFile), 32000000)
    self.assertEqual(count_pulses(self.inputTest2File), 11687500)
    self.assertEqual(count_pulses(self.inputFile), 703315117)
