package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import com.pjestin.lib.Vector;

public class Day12 {
    private record Region(int width, int length, List<Integer> quantities) {}
    private record ShapesAndRegions(List<Set<Vector>> shapes, List<Region> regions) {}

    private static ShapesAndRegions parseShapesAndRegions(List<String> lines) {
        List<Set<Vector>> shapes = new ArrayList<>();
        List<Region> regions = new ArrayList<>();
        int currentRow = 0;
        Set<Vector> currentPositions = new HashSet<>();

        for (String line : lines) {
            if (line.isBlank()) {
                shapes.add(currentPositions);
                currentPositions = new HashSet<>();
                currentRow = 0;
            } else if (line.matches("\\d+x\\d+:.*")) {
                String[] splitLine = line.split(": ");
                String[] splitWidthLength = splitLine[0].split("x");
                int width = Integer.parseInt(splitWidthLength[0]);
                int length = Integer.parseInt(splitWidthLength[1]);
                List<Integer> quantities = Stream.of(splitLine[1].split(" "))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
                regions.add(new Region(width, length, quantities));
            } else if (line.contains(".") || line.contains("#")) {
                for (int col = 0; col < line.length(); col++) {
                    if (line.charAt(col) == '#') {
                        currentPositions.add(new Vector(col, currentRow));
                    }
                }
                currentRow++;
            }
        }

        return new ShapesAndRegions(shapes, regions);
    }

    private static List<Set<Set<Vector>>> computeEquivalents(List<Set<Vector>> shapes) {
        return shapes.stream()
            .map(shape -> {
                Set<Set<Vector>> flippedShapes = new HashSet<>();
                flippedShapes.add(shape);
                // Flipped horizontally
                flippedShapes.add(shape.stream()
                    .map(position -> new Vector(position.x, 2 - position.y))
                    .collect(Collectors.toSet()));
                // Flipped vertically
                flippedShapes.add(shape.stream()
                    .map(position -> new Vector(2 - position.x, position.y))
                    .collect(Collectors.toSet()));
                // Flipped both ways
                flippedShapes.add(shape.stream()
                    .map(position -> new Vector(2 - position.x, 2 - position.y))
                    .collect(Collectors.toSet()));
                
                Set<Set<Vector>> equivalentShapes = new HashSet<>();
                for (Set<Vector> flippedShape : flippedShapes) {
                    Set<Vector> rotatedOnce = buildRotatedShape(flippedShape);
                    Set<Vector> rotatedTwice = buildRotatedShape(rotatedOnce);
                    equivalentShapes.add(flippedShape);
                    equivalentShapes.add(rotatedOnce);
                    equivalentShapes.add(rotatedTwice);
                    equivalentShapes.add(buildRotatedShape(rotatedTwice));
                }

                return equivalentShapes;
            })
            .collect(Collectors.toList());
    }

    private static Optional<Set<Vector>> fitShape(boolean[][] regionGrid, Set<Vector> shape, Vector startPosition) {
        Set<Vector> fittedPositions = new HashSet<>();
        for (Vector position : shape) {
            if (regionGrid[(int)(startPosition.y + position.y)][(int)(startPosition.x + position.x)]) {
                return Optional.empty();
            }
            fittedPositions.add(new Vector(startPosition.x + position.x, startPosition.y + position.y));
        }

        for (Vector fittedPosition : fittedPositions) {
            regionGrid[(int)fittedPosition.y][(int)fittedPosition.x] = true;
        }

        return Optional.of(fittedPositions);
    }

    private static void undoFitting(boolean[][] regionGrid, Set<Vector> positions) {
        for (Vector position : positions) {
            regionGrid[(int)position.y][(int)position.x] = false;
        }
    }

    private static boolean canFit(List<Set<Set<Vector>>> shapes, boolean[][] regionGrid, List<Integer> quantities, long[] nTries) {
        if (nTries[0] <= 0) {
            return false;
        }

        OptionalInt shapeIndexOptional = IntStream.range(0, quantities.size())
            .filter(quantityIndex -> quantities.get(quantityIndex) > 0)
            .findFirst();
        if (shapeIndexOptional.isEmpty()) {
            return true;
        }

        int shapeIndex = shapeIndexOptional.getAsInt();
        Set<Set<Vector>> equivalentShapes = shapes.get(shapeIndex);
        quantities.set(shapeIndex, quantities.get(shapeIndex) - 1);

        for (int startRow = 0; startRow < regionGrid.length - 2; startRow++) {
            for (int startCol = 0; startCol < regionGrid[0].length - 2; startCol++) {
                Vector startPosition = new Vector(startCol, startRow);
                for (Set<Vector> shape : equivalentShapes) {
                    nTries[0]--;
                    Optional<Set<Vector>> fittedShape = fitShape(regionGrid, shape, startPosition);
                    if (fittedShape.isPresent()) {
                        if (canFit(shapes, regionGrid, quantities, nTries)) {
                            return true;
                        }
                        undoFitting(regionGrid, fittedShape.get());
                    }
                }
            }
        }

        quantities.set(shapeIndex, quantities.get(shapeIndex) + 1);

        return false;
    }

    private static Set<Vector> buildRotatedShape(Set<Vector> shape) {
        return shape.stream()
            .map(position -> new Vector(2 - position.y, position.x))
            .collect(Collectors.toSet());
    }

    public static long countFittingRegions(List<String> lines) {
        ShapesAndRegions shapesAndRegions = parseShapesAndRegions(lines);
        List<Region> regions = shapesAndRegions.regions;

        List<Set<Set<Vector>>> equivalentShapes = computeEquivalents(shapesAndRegions.shapes);
        long totalTries = 2000000L;

        return regions.stream()
            .filter(region -> {
                long[] nTries = {totalTries};
                return canFit(equivalentShapes, new boolean[region.length][region.width], new ArrayList<>(region.quantities), nTries);
            })
            .count();
    }
}
