from unittest import TestCase
from day06.day06 import multiply_ways_to_beat, ways_to_beat_aggregated

class Day06Test(TestCase):
  def setUp(self) -> None:
    with open("day06/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day06/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_multiply_ways_to_beat(self) -> None:
    self.assertEqual(multiply_ways_to_beat(self.inputTestFile), 288)
    self.assertEqual(multiply_ways_to_beat(self.inputFile), 219849)
  
  def test_ways_to_beat_aggregated(self) -> None:
    self.assertEqual(ways_to_beat_aggregated(self.inputTestFile), 71503)
    self.assertEqual(ways_to_beat_aggregated(self.inputFile), 29432455)
