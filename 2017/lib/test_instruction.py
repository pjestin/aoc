from unittest import TestCase
from lib.instruction import Instruction


class InstructionTest(TestCase):
    def test_str(self) -> None:
        self.assertEqual("snd a", str(Instruction("snd", "a")))
        self.assertEqual("set a 1", str(Instruction("set", "a", "1")))

    def test_parse_with_1_arg(self) -> None:
        ins = Instruction.parse("snd a")
        self.assertEqual("snd", ins.op)
        self.assertEqual("a", ins.arg1)
        self.assertEqual(None, ins.arg2)

    def test_parse_with_2_args(self) -> None:
        ins = Instruction.parse("mul a 45")
        self.assertEqual("mul", ins.op)
        self.assertEqual("a", ins.arg1)
        self.assertEqual("45", ins.arg2)

    def test_arg1_is_register(self) -> None:
        self.assertTrue(Instruction("set", "a", "1").arg1_is_register())
        self.assertTrue(Instruction("set", "a").arg1_is_register())
        self.assertFalse(Instruction("set", "2", "1").arg1_is_register())

    def test_arg2_is_register(self) -> None:
        self.assertFalse(Instruction("set", "a", "1").arg2_is_register())
        self.assertFalse(Instruction("set", "a").arg2_is_register())
        self.assertTrue(Instruction("set", "a", "b").arg2_is_register())
