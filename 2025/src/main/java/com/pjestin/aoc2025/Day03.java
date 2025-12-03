package com.pjestin.aoc2025;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class Day03 {
    private static List<List<Long>> parseBanks(List<String> lines) {
        return lines.stream().map(line -> Arrays.stream(line.split(""))
            .map(Long::parseLong)
            .collect(Collectors.toList())
        ).collect(Collectors.toList());
    }

    private static long getMaxJoltageForBank(List<Long> bank, int start, int batteriesRemaining, long factor, Map<Integer, Long> cache) {
        int cacheKey = 100 * batteriesRemaining + start;
        if (batteriesRemaining == 0) {
            return 0L;
        } else if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        long maxJoltage = 0;

        for (int i = start; i < bank.size() - batteriesRemaining + 1; i++) {
            long rest = getMaxJoltageForBank(bank, i + 1, batteriesRemaining - 1, factor / 10, cache);
            maxJoltage = Math.max(maxJoltage, factor * bank.get(i) + rest);
        }

        cache.put(cacheKey, maxJoltage);
        return maxJoltage;
    }

    public static long findMaxJoltage(List<String> lines, int nBatteries) {
        List<List<Long>> banks = parseBanks(lines);
        return banks
            .stream()
            .map(bank -> getMaxJoltageForBank(bank, 0, nBatteries, (long) Math.pow(10L, nBatteries - 1), new HashMap<>()))
            .reduce(0L, (sum, joltage) -> sum + joltage);
    }
}
