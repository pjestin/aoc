package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day04Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day04", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day04", "input-test.txt"));
    }

    @Test
    public void test_countccessiblePaperRolls() {
        assertEquals(13, Day04.countAccessiblePaperRolls(inputTestLines));
        assertEquals(1435, Day04.countAccessiblePaperRolls(inputLines));
    }

    @Test
    public void test_countAccessiblePaperRollsMultipleIterations() {
        assertEquals(43, Day04.countAccessiblePaperRollsMultipleIterations(inputTestLines));
        assertEquals(8623, Day04.countAccessiblePaperRollsMultipleIterations(inputLines));
    }
}
