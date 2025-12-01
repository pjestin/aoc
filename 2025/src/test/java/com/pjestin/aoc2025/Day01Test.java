package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;
import com.pjestin.lib.FileUtils;

public class Day01Test {
    private static List<String> inputLines;
    private static List<String> inputTestLines;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day01", "input.txt"));
        inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day01", "input-test.txt"));
    }

    @Test
    public void test_findPassword() {
        assertEquals(3, Day01.findPassword(inputTestLines));
        assertEquals(1081, Day01.findPassword(inputLines));
    }

    @Test
    public void test_findPasswordAnyClick() {
        assertEquals(6, Day01.findPasswordAnyClick(inputTestLines));
        assertEquals(6689, Day01.findPasswordAnyClick(inputLines));
    }
}
