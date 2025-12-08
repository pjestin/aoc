package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day08Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day08", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day08", "input-test.txt"));
    }

    @Test
    public void test_connectJunctionBoxes() {
        assertEquals(40L, Day08.connectJunctionBoxes(inputTestLines, 10));
        assertEquals(63920L, Day08.connectJunctionBoxes(inputLines, 1000));
    }

    @Test
    public void test_continueConnecting() {
        assertEquals(25272L, Day08.continueConnecting(inputTestLines));
        assertEquals(1026594680L, Day08.continueConnecting(inputLines));
    }
}
