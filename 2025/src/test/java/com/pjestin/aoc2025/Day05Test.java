package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day05Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day05", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day05", "input-test.txt"));
    }

    @Test
    public void test_countAvailableFreshIngredients() {
        assertEquals(3L, Day05.countAvailableFreshIngredients(inputTestLines));
        assertEquals(567, Day05.countAvailableFreshIngredients(inputLines));
    }

    @Test
    public void test_countAllFreshIngredients() {
        assertEquals(14L, Day05.countAllFreshIngredients(inputTestLines));
        assertEquals(354149806372909L, Day05.countAllFreshIngredients(inputLines));
    }
}
