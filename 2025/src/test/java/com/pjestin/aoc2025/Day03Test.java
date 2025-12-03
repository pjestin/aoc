package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day03Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day03", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day03", "input-test.txt"));
    }

    @Test
    public void test_findMaxJoltage() {
        assertEquals(357, Day03.findMaxJoltage(inputTestLines, 2));
        assertEquals(17281, Day03.findMaxJoltage(inputLines, 2));
    }

    @Test
    public void test_findMaxJoltage_moreBatteries() {
        assertEquals(3121910778619L, Day03.findMaxJoltage(inputTestLines, 12));
        assertEquals(171388730430281L, Day03.findMaxJoltage(inputLines, 12));
    }
}
