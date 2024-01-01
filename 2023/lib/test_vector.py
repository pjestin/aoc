from unittest import TestCase

from lib.vector import Vector


class VectorTest(TestCase):
    def test_str(self):
        self.assertEqual("(1;-8;0)", str(Vector(1, -8)))

    def test_eq(self):
        self.assertEqual(Vector(1, 9), Vector(1, 9))
        self.assertNotEqual(Vector(1, 9), Vector(1, 10))

    def test_add(self):
        self.assertEqual(Vector(1, 10), Vector(-2, -7) + Vector(3, 17))

    def test_iadd(self):
        vector = Vector(6, -8)
        vector += Vector(5, -2)
        self.assertEqual(Vector(11, -10), vector)

    def test_sub(self):
        self.assertEqual(Vector(-5, -24), Vector(-2, -7) - Vector(3, 17))

    def test_isub(self):
        vector = Vector(6, -8)
        vector -= Vector(5, -2)
        self.assertEqual(Vector(1, -6), vector)

    def test_neg(self):
        vector = Vector(6, -8)
        self.assertEqual(Vector(-6, 8), -vector)

    def test_abs(self):
        self.assertEqual(6, abs(Vector(2, -4)))

    def test_rmul(self):
        self.assertEqual(Vector(9, -12), 3 * Vector(3, -4))

    def test_hash(self):
        self.assertEqual(hash(Vector(14, -2)), hash(Vector(14, -2)))
        self.assertNotEqual(hash(Vector(13, -2)), hash(Vector(14, -2)))

    def test_distance(self):
        self.assertEqual(10, Vector(4, 5).distance(Vector(-1, 0)))

    def test_3d_vector(self):
        v1 = Vector(1, -8, 5)
        v2 = Vector(-1, 2, 8)
        self.assertEqual(Vector(0, -6, 13), v1 + v2)
        self.assertEqual(Vector(2, -10, -3), v1 - v2)
        self.assertEqual(14, abs(v1))
        self.assertEqual(15, v1.distance(v2))
