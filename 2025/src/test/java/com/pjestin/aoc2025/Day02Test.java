package com.pjestin.aoc2025;

import static org.junit.jupiter.api.Assertions.assertEquals;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import com.pjestin.lib.FileUtils;

public class Day02Test {
    private static String inputLine;
    private static String inputTestLine;

    @BeforeAll
    public static void setUp() throws FileNotFoundException {
        inputLine = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day02", "input.txt")).get(0);
        inputTestLine = FileUtils.readLines(Paths.get("src", "test", "resources", "com", "pjestin", "aoc2025", "day02", "input-test.txt")).get(0);
    }

    @Test
    public void test_findInvalidIDs() {
        assertEquals(1227775554L, Day02.findInvalidIDs(inputTestLine));
        assertEquals(28844599675L, Day02.findInvalidIDs(inputLine));
    }

    @Test
    public void test_findInvalidIDsMultiRepeat() {
        assertEquals(4174379265L, Day02.findInvalidIDsMultiRepeat(inputTestLine));
        assertEquals(48778605167L, Day02.findInvalidIDsMultiRepeat(inputLine));
    }
}
