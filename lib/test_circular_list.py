from unittest import TestCase

from lib.circular_list import CircularList


class CircularListTest(TestCase):
    def test_str(self) -> None:
        self.assertEqual("[0, 3, 4, 5]", str(CircularList([0, 3, 4, 5])))

    def test_eq(self) -> None:
        self.assertEqual(CircularList([0, 3, 4, 5]), CircularList([0, 3, 4, 5]))
        self.assertNotEqual(CircularList([0, 3, 4, 5]), CircularList([0, 3, 4, 6]))

    def test_set_item(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        lst[2] = 17
        lst[5] = 81
        self.assertEqual(CircularList([0, 81, 17, 5]), lst)

    def test_get_item(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        self.assertEqual(3, lst[1])
        self.assertEqual(4, lst[-2])

    def test_del_item(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        del lst[2]
        self.assertEqual(CircularList([0, 3, 5]), lst)

    def test_set_item_slice(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        lst[0:2] = [24, 26]
        self.assertEqual(CircularList([24, 26, 4, 5]), lst)

    def test_set_item_slice_circle(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        lst[3:6] = [65, 66, 67]
        self.assertEqual(CircularList([66, 67, 4, 65]), lst)

    def test_get_item_slice(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        self.assertEqual([3, 4], lst[1:3])

    def test_get_item_slice_circle(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        self.assertEqual([4, 5, 0], lst[2:5])

    def test_del_item_slice(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        del lst[1:3]
        self.assertEqual(CircularList([0, 5]), lst)

    def test_del_item_slice_circle(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        del lst[3:6]
        self.assertEqual(CircularList([4]), lst)

    def test_reverse_sublist(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        lst.reverse_sublist(slice(0, 2))
        self.assertEqual(CircularList([3, 0, 4, 5]), lst)

    def test_reverse_sublist_circle(self) -> None:
        lst = CircularList([0, 3, 4, 5])
        lst.reverse_sublist(slice(2, 5))
        self.assertEqual(CircularList([4, 3, 0, 5]), lst)
