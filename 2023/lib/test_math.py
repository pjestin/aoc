from unittest import TestCase

from lib.math import gcd, lcm

class MathTest(TestCase):
  def test_gcd(self):
    self.assertEqual(1, gcd(1, 8))
    self.assertEqual(2, gcd(4, 8))
    self.assertEqual(18, gcd(54, 18))
    self.assertEqual(1, gcd(2, 3))

  def test_lcm(self):
    self.assertEqual(8, lcm(1, 8))
    self.assertEqual(8, lcm(4, 8))
    self.assertEqual(54, lcm(54, 18))
    self.assertEqual(6, lcm(2, 3))
