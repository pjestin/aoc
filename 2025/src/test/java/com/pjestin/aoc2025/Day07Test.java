package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day07Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day07", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day07", "input-test.txt"));
    }

    @Test
    public void test_countTachyonSplits() {
        assertEquals(21, Day07.countTachyonSplits(inputTestLines));
        assertEquals(1541, Day07.countTachyonSplits(inputLines));
    }

    @Test
    public void test_countTimelines() {
        assertEquals(40L, Day07.countTimelines(inputTestLines));
        assertEquals(80158285728929L, Day07.countTimelines(inputLines));
    }
}
