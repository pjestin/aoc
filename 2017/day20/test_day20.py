from unittest import TestCase
from day20.day20 import find_closest_long_term_particle, count_non_colliding_particles


class Day20Test(TestCase):
    def setUp(self) -> None:
        with open("day20/input.txt", "r") as file:
            self.inputFile = file.read().splitlines()
        with open("day20/input-test.txt", "r") as file:
            self.inputTestFile = file.read().splitlines()
        with open("day20/input-test-2.txt", "r") as file:
            self.inputTest2File = file.read().splitlines()

    def test_find_closest_long_term_particle(self) -> None:
        self.assertEqual(0, find_closest_long_term_particle(self.inputTestFile))
        self.assertEqual(161, find_closest_long_term_particle(self.inputFile))

    def test_count_non_colliding_particles(self) -> None:
        self.assertEqual(1, count_non_colliding_particles(self.inputTest2File))
        self.assertEqual(438, count_non_colliding_particles(self.inputFile))
