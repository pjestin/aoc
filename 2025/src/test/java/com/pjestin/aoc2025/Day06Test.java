package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.FileNotFoundException;
import java.nio.file.Paths;
import java.util.List;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import com.pjestin.lib.FileUtils;

public class Day06Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day06", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day06", "input-test.txt"));
    }

    @Test
    public void test_findGrandTotal() {
        assertEquals(4277556L, Day06.findGrandTotal(inputTestLines));
        assertEquals(5227286044585L, Day06.findGrandTotal(inputLines));
    }

    @Test
    public void test_findGrandTotalCephalopod() {
        assertEquals(3263827L, Day06.findGrandTotalCephalopod(inputTestLines));
        assertEquals(10227753257799L, Day06.findGrandTotalCephalopod(inputLines));
    }
}
