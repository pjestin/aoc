package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Day06 {
    private enum Operation {
        ADDITION,
        MULTIPLICATION;
    }

    static private class Problem {
        List<Long> numbers;
        Operation operation;

        public Problem(List<Long> numbers, Operation operation) {
            this.numbers = numbers;
            this.operation = operation;
        }

        public long computeResult() {
            if (this.numbers == null || this.numbers.isEmpty() || this.operation == null) {
                throw new RuntimeException("Invalid problem");
            }

            return switch (this.operation) {
                case ADDITION -> this.numbers.stream().reduce(0L, (acc, number) -> acc + number);
                case MULTIPLICATION -> this.numbers.stream().reduce(1L, (acc, number) -> acc * number);
            };
        }
    }

    private static Operation operationFromChar(char c) {
        return switch (c) {
            case '+' -> Operation.ADDITION;
            case '*' -> Operation.MULTIPLICATION;
            default -> throw new RuntimeException("Unknown operation: " + c);
        };
    }

    private static List<Problem> parseProblems(List<String> lines) {
        List<List<String>> splitLines = lines.stream()
            .map(line -> Arrays.asList(line.split("\\s+")).stream()
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList()))
            .collect(Collectors.toList());

        int nNumbers = splitLines.size() - 1;

        return IntStream.range(0, splitLines.get(0).size()).mapToObj(problemIndex -> {
            List<Long> numbers = IntStream.range(0, nNumbers)
                .mapToLong(numberIndex -> {
                    return Long.parseLong(splitLines.get(numberIndex).get(problemIndex));
                })
                .boxed()
                .toList();

            Operation operation = operationFromChar(splitLines.get(nNumbers).get(problemIndex).charAt(0));

            return new Problem(numbers, operation);
        })
        .collect(Collectors.toList());
    }

    public static long findGrandTotal(List<String> lines) {
        List<Problem> problems = parseProblems(lines);
        return problems.stream()
            .map(Problem::computeResult)
            .reduce(0L, (acc, result) -> acc + result);
    }

    private static List<Problem> parseProblemsCephalopod(List<String> lines) {
        List<Problem> problems = new ArrayList<>();
        List<Long> numbers = new ArrayList<>();
        int lineLength = lines.get(0).length();
        int nNumbers = lines.size() - 1;

        for (int digitIndex = lineLength - 1; digitIndex >= 0; digitIndex--) {
            StringBuilder sb = new StringBuilder();
            for (int lineIndex = 0; lineIndex < nNumbers; lineIndex++) {
                char c = lines.get(lineIndex).charAt(digitIndex);
                if (c != ' ') {
                    sb.append(c);
                }
            }

            String digitString = sb.toString();

            if (digitString.isEmpty()) {
                Operation operation = operationFromChar(lines.get(nNumbers).charAt(digitIndex + 1));
                problems.add(new Problem(numbers, operation));
                numbers = new ArrayList<>();
            } else {
                numbers.add(Long.parseLong(digitString));
            }
        }

        if (!numbers.isEmpty()) {
            Operation operation = operationFromChar(lines.get(nNumbers).charAt(0));
            problems.add(new Problem(numbers, operation));
        }

        return problems;
    }

    public static long findGrandTotalCephalopod(List<String> lines) {
        List<Problem> problems = parseProblemsCephalopod(lines);
        return problems.stream()
            .map(Problem::computeResult)
            .reduce(0L, (acc, result) -> acc + result);
    }
}
