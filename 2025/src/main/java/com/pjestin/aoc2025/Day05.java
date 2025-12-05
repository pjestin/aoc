package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Map.Entry;
import java.util.SortedMap;
import java.util.TreeMap;

public class Day05 {
    private record IngredientRange(long start, long end) {}

    private record IngredientInfo(List<IngredientRange> freshIngredientRanges, List<Long> availableIngredients) {}

    private static IngredientInfo parseIngredients(List<String> lines) {
        List<IngredientRange> freshIngredientRanges = new ArrayList<>();
        List<Long> availableIngredients = new ArrayList<>();
        boolean emptyLine = false;

        for (String line : lines) {
            if ("".equals(line)) {
                emptyLine = true;
            } else if (!emptyLine) {
                String[] splitLine = line.split("-");
                freshIngredientRanges.add(new IngredientRange(Long.parseLong(splitLine[0]), Long.parseLong(splitLine[1])));
            } else {
                availableIngredients.add(Long.parseLong(line));
            }
        }

        return new IngredientInfo(freshIngredientRanges, availableIngredients);
    }

    private static boolean isFresh(long ingredient, List<IngredientRange> freshIngredientRanges) {
        for (IngredientRange freshIngredientRange : freshIngredientRanges) {
            if (ingredient >= freshIngredientRange.start && ingredient <= freshIngredientRange.end) {
                return true;
            }
        }

        return false;
    }

    public static long countAvailableFreshIngredients(List<String> lines) {
        IngredientInfo ingredientInfo = parseIngredients(lines);

        return ingredientInfo.availableIngredients
            .stream()
            .filter(ingredient -> isFresh(ingredient, ingredientInfo.freshIngredientRanges))
            .count();
    }

    public static long countAllFreshIngredients(List<String> lines) {
        IngredientInfo ingredientInfo = parseIngredients(lines);

        SortedMap<Long, Integer> freshnessChanges = new TreeMap<>();
        for (IngredientRange freshIngredientRange : ingredientInfo.freshIngredientRanges) {
            freshnessChanges.put(freshIngredientRange.start, freshnessChanges.getOrDefault(freshIngredientRange.start, 0) + 1);
            freshnessChanges.put(freshIngredientRange.end + 1, freshnessChanges.getOrDefault(freshIngredientRange.end + 1, 0) - 1);
        }

        int currentFreshness = 0;
        long freshIngredientCount = 0L;
        Optional<Long> previousIngredient = Optional.empty();
        for (Entry<Long, Integer> freshnessChange : freshnessChanges.entrySet()) {
            if (currentFreshness > 0 && previousIngredient.isPresent()) {
                freshIngredientCount += freshnessChange.getKey() - previousIngredient.get();
            }
            currentFreshness += freshnessChange.getValue();
            previousIngredient = Optional.of(freshnessChange.getKey());
        }

        return freshIngredientCount;
    }
}
