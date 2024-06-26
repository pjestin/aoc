from unittest import TestCase
from day24.day24 import count_intersection, origin_all_collitions

class Day24Test(TestCase):
  def setUp(self) -> None:
    with open("day24/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day24/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_count_intersection(self) -> None:
    self.assertEqual(count_intersection(self.inputTestFile, (7, 27)), 2)
    self.assertEqual(count_intersection(self.inputFile, (200000000000000, 400000000000000)), 24627)

  def test_origin_all_collisions(self) -> None:
    self.assertEqual(origin_all_collitions(self.inputTestFile), 47)
    self.assertEqual(origin_all_collitions(self.inputFile), 527310134398221)
