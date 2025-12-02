package com.pjestin.aoc2025;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Day02 {
    private record Range(long start, long end) {}

    private static List<Range> parseRanges(String line) {
        return Arrays.stream(line.split(",")).map(stringRange -> {
            String[] splitRange = stringRange.split("-");
            return new Range(Long.parseLong(splitRange[0]), Long.parseLong(splitRange[1]));
        }).collect(Collectors.toList());
    }

    private static boolean isInvalidID(long i) {
        String stringInt = String.valueOf(i);
        int size = stringInt.length();

        if (size % 2 != 0) {
            return false;
        }

        String firstHalf = stringInt.substring(0, size / 2);
        String secondHalf = stringInt.substring(size / 2, size);
        return firstHalf.equals(secondHalf);
    }

    public static long findInvalidIDs(String line) {
        List<Range> ranges = parseRanges(line);
        long invalidIDSum = 0;

        for (Range range : ranges) {
            for (long i = range.start; i <= range.end; i++) {
                if (isInvalidID(i)) {
                    invalidIDSum += i;
                }
            }
        }

        return invalidIDSum;
    }

    private static boolean isInvalidIDAllowMultiRepeat(long i) {
        String stringInt = String.valueOf(i);
        int size = stringInt.length();

        for (int subLength = 1; subLength <= size / 2; subLength++) {
            if (size % subLength != 0) {
                continue;
            }

            boolean areSubStringsEqual = true;

            for (int subStringIndex = 0; subStringIndex < size / subLength - 1; subStringIndex++) {
                String subString1 = stringInt.substring(subStringIndex * subLength, (subStringIndex + 1) * subLength);
                String subString2 = stringInt.substring((subStringIndex + 1) * subLength, (subStringIndex + 2) * subLength);
                if (!subString1.equals(subString2)) {
                    areSubStringsEqual = false;
                    break;
                }
            }

            if (areSubStringsEqual) {
                return true;
            }
        }

        return false;
    }

    public static long findInvalidIDsMultiRepeat(String line) {
        List<Range> ranges = parseRanges(line);
        long invalidIDSum = 0;

        for (Range range : ranges) {
            for (long i = range.start; i <= range.end; i++) {
                if (isInvalidIDAllowMultiRepeat(i)) {
                    invalidIDSum += i;
                }
            }
        }

        return invalidIDSum;
    }
}
