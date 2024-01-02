from unittest import TestCase
from day19.day19 import sum_accepted_ratings, count_distinct_combinations

class Day19Test(TestCase):
  def setUp(self) -> None:
    with open("day19/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day19/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_sum_accepted_ratings(self) -> None:
    self.assertEqual(sum_accepted_ratings(self.inputTestFile), 19114)
    self.assertEqual(sum_accepted_ratings(self.inputFile), 362930)

  def test_count_distinct_combinations(self) -> None:
    self.assertEqual(count_distinct_combinations(self.inputTestFile), 167409079868000)
    self.assertEqual(count_distinct_combinations(self.inputFile), 116365820987729)
