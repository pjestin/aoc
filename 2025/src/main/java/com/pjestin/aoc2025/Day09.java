package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.pjestin.lib.Vector;

public class Day09 {
    private static List<Vector> parseRedTiles(List<String> lines) {
        return lines.stream().map(line -> {
            String[] splitLine = line.split(",");
            long x = Long.parseLong(splitLine[1]);
            long y = Long.parseLong(splitLine[0]);
            return new Vector(x, y);
        }).collect(Collectors.toList());
    }

    private record Rectangle(Vector corner1, Vector corner2, long area) {}

    private static List<Rectangle> buildSortedRectangles(List<Vector> redTiles) {
        List<Rectangle> sortedRectangles = new ArrayList<>();

        for (int i = 0; i < redTiles.size() - 1; i++) {
            for (int j = i + 1; j < redTiles.size(); j++) {
                Vector redTile1 = redTiles.get(i);
                Vector redTile2 = redTiles.get(j);
                long area = (Math.abs(redTile1.x - redTile2.x) + 1) * (Math.abs(redTile1.y - redTile2.y) + 1);
                sortedRectangles.add(new Rectangle(redTile1, redTile2, area));
            }
        }

        sortedRectangles.sort((a, b) -> Long.compare(b.area, a.area));
        return sortedRectangles;
    }

    public static long findLargestRectangle(List<String> lines) {
        List<Vector> redTiles = parseRedTiles(lines);
        List<Rectangle> sortedRectangles = buildSortedRectangles(redTiles);
        return sortedRectangles.get(0).area;
    }

    private static boolean isInside(Rectangle rectangle, List<Vector> redTiles) {
        for (int i = 0; i < redTiles.size(); i++) {
            Vector redTile1 = redTiles.get(i);
            Vector redTile2 = redTiles.get((i + 1) % redTiles.size());

            if (redTile1.x == redTile2.x) {
                long x = redTile1.x;
                if (x > Math.min(rectangle.corner1.x, rectangle.corner2.x) && x < Math.max(rectangle.corner1.x, rectangle.corner2.x) &&
                    Math.min(redTile1.y, redTile2.y) < Math.max(rectangle.corner1.y, rectangle.corner2.y) &&
                    Math.max(redTile1.y, redTile2.y) > Math.min(rectangle.corner1.y, rectangle.corner2.y)
                ) {
                    return false;
                }
            } else if (redTile1.y == redTile2.y) {
                long y = redTile1.y;
                if (y > Math.min(rectangle.corner1.y, rectangle.corner2.y) && y < Math.max(rectangle.corner1.y, rectangle.corner2.y) &&
                    Math.min(redTile1.x, redTile2.x) < Math.max(rectangle.corner1.x, rectangle.corner2.x) &&
                    Math.max(redTile1.x, redTile2.x) > Math.min(rectangle.corner1.x, rectangle.corner2.x)
                ) {
                    return false;
                }
            } else {
                throw new RuntimeException("Adjacent red tiles not aligned");
            }
        }

        return true;
    }

    public static long findLargestRedOrGreenRectangle(List<String> lines) {
        List<Vector> redTiles = parseRedTiles(lines);
        List<Rectangle> sortedRectangles = buildSortedRectangles(redTiles);

        return sortedRectangles.stream()
            .filter(rectangle -> isInside(rectangle, redTiles))
            .findAny()
            .get().area;
    }
}
