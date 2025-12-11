package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day11Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;
    private static List<String> inputTest2Lines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day11", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day11", "input-test.txt"));
        inputTest2Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day11", "input-test2.txt"));
    }

    @Test
    public void test_countPathsFromYou() {
        assertEquals(5, Day11.countPathsFromYou(inputTestLines));
        assertEquals(534, Day11.countPathsFromYou(inputLines));
    }

    @Test
    public void test_countPathsFromSvr() {
        assertEquals(2L, Day11.countPathsFromSvr(inputTest2Lines));
        assertEquals(499645520864100L, Day11.countPathsFromSvr(inputLines));
    }
}
