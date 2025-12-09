package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day09Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day09", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day09", "input-test.txt"));
    }

    @Test
    public void test_findLargestRectangle() {
        assertEquals(50L, Day09.findLargestRectangle(inputTestLines));
        assertEquals(4749838800L, Day09.findLargestRectangle(inputLines));
    }

    @Test
    public void test_findLargestRedOrGreenRectangle() {
        assertEquals(24L, Day09.findLargestRedOrGreenRectangle(inputTestLines));
        assertEquals(1624057680L, Day09.findLargestRedOrGreenRectangle(inputLines));
    }
}
