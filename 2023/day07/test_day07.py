from unittest import TestCase
from day07.day07 import total_winnings, total_winnings_joker

class Day07Test(TestCase):
  def setUp(self) -> None:
    with open("day07/input.txt", "r") as file:
      self.inputFile = file.read().splitlines()
    with open("day07/input-test.txt", "r") as file:
      self.inputTestFile = file.read().splitlines()

  def test_total_winnings(self) -> None:
    self.assertEqual(total_winnings(self.inputTestFile), 6440)
    self.assertEqual(total_winnings(self.inputFile), 246409899)
  
  def test_total_winnings_joker(self) -> None:
    self.assertEqual(total_winnings_joker(self.inputTestFile), 5905)
    self.assertEqual(total_winnings_joker(self.inputFile), 244848487)
