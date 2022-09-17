from unittest import TestCase
from day14.day14 import count_used_memory, count_regions


class Day14Test(TestCase):
    def test_count_used_memory(self) -> None:
        self.assertEqual(8108, count_used_memory("flqrgnkx"))
        self.assertEqual(8194, count_used_memory("uugsqrei"))

    def test_count_regions(self) -> None:
        self.assertEqual(1242, count_regions("flqrgnkx"))
        self.assertEqual(1141, count_regions("uugsqrei"))
