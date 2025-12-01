package com.pjestin.aoc2025;

import java.util.List;
import java.util.stream.Collectors;

import com.pjestin.lib.Maths;

public class Day01 {
    private enum Direction {
        LEFT,
        RIGHT;
    }

    private record Instruction(Direction direction, int amount) {}

    private static List<Instruction> parseInstructions(List<String> lines) {
        return lines.stream().map(line -> {
            Direction direction = switch (line.charAt(0)) {
                case 'L' -> Direction.LEFT;
                case 'R' -> Direction.RIGHT;
                default -> throw new RuntimeException("Unrecognized instruction: " + line);
            };

            int amount = Integer.parseInt(line.substring(1));

            return new Instruction(direction, amount);
        }).collect(Collectors.toList());
    }

    public static int findPassword(List<String> lines) {
        List<Instruction> instructions = parseInstructions(lines);

        int dial = 50;
        int password = 0;

        for (Instruction instruction : instructions) {
            int factor = switch (instruction.direction) {
                case LEFT -> -1;
                case RIGHT -> 1;
            };

            dial = Maths.mod(dial + factor * instruction.amount, 100);

            if (dial == 0) {
                password++;
            }
        }

        return password;
    }

    public static int findPasswordAnyClick(List<String> lines) {
        List<Instruction> instructions = parseInstructions(lines);

        int dial = 50;
        int password = 0;

        for (Instruction instruction : instructions) {
            int factor = switch (instruction.direction) {
                case LEFT -> -1;
                case RIGHT -> 1;
            };

            int amount = instruction.amount;

            while (amount > 0) {
                dial = Maths.mod(dial + factor, 100);

                if (dial == 0) {
                    password++;
                }

                amount--;
            }
        }

        return password;
    }
}
