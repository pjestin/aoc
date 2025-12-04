package com.pjestin.aoc2025;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.pjestin.lib.Vector;

public class Day04 {
    private static final List<Vector> NEIGHBORS = Arrays.asList(
        new Vector(-1, 0),
        new Vector(-1, 1),
        new Vector(0, 1),
        new Vector(1, 1),
        new Vector(1, 0),
        new Vector(1, -1),
        new Vector(0, -1),
        new Vector(-1, -1)
    );

    private static Set<Vector> parsePaperRolls(List<String> lines) {
        Set<Vector> paperRolls = new HashSet<>();

        for (int row = 0; row < lines.size(); row++) {
            for (int col = 0; col < lines.get(0).length(); col++) {
                if (lines.get(row).charAt(col) == '@') {
                    paperRolls.add(new Vector(col, row));
                }
            }
        }

        return paperRolls;
    }

    private static boolean isAccessible(Vector paperRoll, Set<Vector> paperRolls) {
        int neighboringPaperRolls = 0;

        for (Vector relativeNeighbor : NEIGHBORS) {
            Vector neighbor = new Vector(paperRoll).add(relativeNeighbor);
            if (paperRolls.contains(neighbor)) {
                neighboringPaperRolls++;
            }
        }

        return neighboringPaperRolls < 4;
    }

    public static int countAccessiblePaperRolls(List<String> lines) {
        Set<Vector> paperRolls = parsePaperRolls(lines);
        int accessiblePaperRolls = 0;

        for (Vector paperRoll : paperRolls) {
            if (isAccessible(paperRoll, paperRolls)) {
                accessiblePaperRolls++;
            }
        }

        return accessiblePaperRolls;
    }

    public static int countAccessiblePaperRollsMultipleIterations(List<String> lines) {
        Set<Vector> paperRolls = parsePaperRolls(lines);
        int initialPaperRollCount = paperRolls.size();
        boolean anyRemoved = true;

        while (anyRemoved) {
            Set<Vector> nextPaperRolls = new HashSet<>(paperRolls);

            for (Vector paperRoll : paperRolls) {
                if (isAccessible(paperRoll, paperRolls)) {
                    nextPaperRolls.remove(paperRoll);
                }
            }

            anyRemoved = nextPaperRolls.size() != paperRolls.size();
            paperRolls = nextPaperRolls;
        }

        return initialPaperRollCount - paperRolls.size();
    }
}
