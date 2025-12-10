package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day10Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day10", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day10", "input-test.txt"));
    }

    @Test
    public void test_countIndicatorLightFewestPushes() {
        assertEquals(7, Day10.countIndicatorLightFewestPushes(inputTestLines));
        assertEquals(505, Day10.countIndicatorLightFewestPushes(inputLines));
    }

    @Test
    public void test_countJoltageFewestPushes() {
        assertEquals(33, Day10.countJoltageFewestPushes(inputTestLines));
        // assertEquals(505, Day10.countJoltageFewestPushes(inputLines));
    }
}
