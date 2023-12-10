from unittest import TestCase
from day10.day10 import find_farthest_distance, count_enclosed_tiles

class Day10Test(TestCase):
  def setUp(self) -> None:
    with open("day10/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day10/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()
    with open("day10/input-test-2.txt", "r") as file:
      self.inputTest2File = file.read().splitlines()
    with open("day10/input-test-3.txt", "r") as file:
      self.inputTest3File = file.read().splitlines()
    with open("day10/input-test-4.txt", "r") as file:
      self.inputTest4File = file.read().splitlines()

  def test_find_farthest_distance(self) -> None:
    self.assertEqual(find_farthest_distance(self.inputTestFile), 8)
    self.assertEqual(find_farthest_distance(self.inputTest2File), 22)
    self.assertEqual(find_farthest_distance(self.inputTest3File), 70)
    self.assertEqual(find_farthest_distance(self.inputFile), 6828)

  def test_count_enclosed_tiles(self) -> None:
    self.assertEqual(count_enclosed_tiles(self.inputTest2File), 4)
    self.assertEqual(count_enclosed_tiles(self.inputTest3File), 8)
    self.assertEqual(count_enclosed_tiles(self.inputTest4File), 10)
    self.assertEqual(count_enclosed_tiles(self.inputFile), 459)
