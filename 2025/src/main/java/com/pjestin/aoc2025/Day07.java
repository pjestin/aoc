package com.pjestin.aoc2025;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.stream.Collectors;

public class Day07 {
    private record TachyonManifold(int startIndex, List<Set<Integer>> splitters) {}

    private static TachyonManifold parseManifold(List<String> lines) {
        int startIndex = lines.get(0).indexOf('S');
        List<Set<Integer>> splitters = lines.stream().map(line -> {
            Set<Integer> splitterIndices = new HashSet<>();
            for (int lineIndex = 0; lineIndex < line.length(); lineIndex++) {
                if (line.charAt(lineIndex) == '^') {
                    splitterIndices.add(lineIndex);
                }
            }
            return splitterIndices;
        }).collect(Collectors.toList());

        return new TachyonManifold(startIndex, splitters);
    }

    public static int countTachyonSplits(List<String> lines) {
        TachyonManifold manifold = parseManifold(lines);
        Set<Integer> tachyonIndices = new HashSet<>(Arrays.asList(manifold.startIndex));
        int splitterCount = 0;

        for (int row = 0; row < manifold.splitters.size(); row++) {
            Set<Integer> newTachyonIndices = new HashSet<>();

            for (int tachyonIndex : tachyonIndices) {
                if (manifold.splitters.get(row).contains(tachyonIndex)) {
                    newTachyonIndices.add(tachyonIndex - 1);
                    newTachyonIndices.add(tachyonIndex + 1);
                    splitterCount++;
                } else {
                    newTachyonIndices.add(tachyonIndex);
                }
            }

            tachyonIndices = newTachyonIndices;
        }

        return splitterCount;
    }

    public static long countTimelines(List<String> lines) {
        TachyonManifold manifold = parseManifold(lines);
        Map<Integer, Long> tachyonIndices = new HashMap<>();
        tachyonIndices.put(manifold.startIndex, 1L);

        for (int row = 0; row < manifold.splitters.size(); row++) {
            Map<Integer, Long> newTachyonIndices = new HashMap<>();

            for (Entry<Integer, Long> tachyonEntry : tachyonIndices.entrySet()) {
                int tachyonIndex = tachyonEntry.getKey();
                long nTachyons = tachyonEntry.getValue();
                if (manifold.splitters.get(row).contains(tachyonEntry.getKey())) {
                    newTachyonIndices.put(tachyonIndex - 1, newTachyonIndices.getOrDefault(tachyonIndex - 1, 0L) + nTachyons);
                    newTachyonIndices.put(tachyonIndex + 1, newTachyonIndices.getOrDefault(tachyonIndex + 1, 0L) + nTachyons);
                } else {
                    newTachyonIndices.put(tachyonIndex, newTachyonIndices.getOrDefault(tachyonIndex, 0L) + nTachyons);
                }
            }

            tachyonIndices = newTachyonIndices;
        }

        return tachyonIndices.values()
            .stream()
            .reduce(0L, (acc, n) -> acc + n);
    }
}
