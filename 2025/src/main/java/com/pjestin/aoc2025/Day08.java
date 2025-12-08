package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import com.pjestin.lib.Vector;

public class Day08 {
    private static List<Vector> parseJunctionBoxes(List<String> lines) {
        return lines.stream().map(line -> {
            String[] splitLine = line.split(",");
            int x = Integer.parseInt(splitLine[0]);
            int y = Integer.parseInt(splitLine[1]);
            int z = Integer.parseInt(splitLine[2]);
            return new Vector(x, y, z);
        }).collect(Collectors.toList());
    }

    private record JunctionBoxPair(int boxIndex1, int boxIndex2, double distance) {};

    private static List<JunctionBoxPair> findClosestPairs(List<Vector> junctionBoxes, int nIterations) {
        PriorityQueue<JunctionBoxPair> maxHeap = new PriorityQueue<>(Comparator.comparing(pair -> pair.distance, (d1, d2) -> d2.compareTo(d1)));

        for (int i = 0; i < junctionBoxes.size() - 1; i++) {
            Vector box1 = junctionBoxes.get(i);
            for (int j = i + 1; j < junctionBoxes.size(); j++) {
                Vector box2 = junctionBoxes.get(j);
                double distance = Math.sqrt(Math.pow(box1.x - box2.x, 2) + Math.pow(box1.y - box2.y, 2) + Math.pow(box1.z - box2.z, 2));
                if (maxHeap.isEmpty() || distance < maxHeap.peek().distance) {
                    if (maxHeap.size() >= nIterations) {
                        maxHeap.remove();
                    }
                    maxHeap.add(new JunctionBoxPair(i, j, distance));
                }
            }
        }

        List<JunctionBoxPair> result = new ArrayList<>();
        while (!maxHeap.isEmpty()) {
            result.addFirst(maxHeap.remove());
        }

        return result;
    }

    public static long connectJunctionBoxes(List<String> lines, int nIterations) {
        List<Vector> junctionBoxes = parseJunctionBoxes(lines);
        int nBoxes = junctionBoxes.size();
        List<JunctionBoxPair> closestPairs = findClosestPairs(junctionBoxes, nIterations);
        List<Integer> boxToCircuit = IntStream.range(0, nBoxes)
            .boxed()
            .collect(Collectors.toList());

        for (JunctionBoxPair closestPair : closestPairs) {
            if (!boxToCircuit.get(closestPair.boxIndex1).equals(boxToCircuit.get(closestPair.boxIndex2))) {
                List<Integer> newBoxToCircuit = new ArrayList<>(boxToCircuit);

                for (int junctionBoxIndex = 0; junctionBoxIndex < nBoxes; junctionBoxIndex++) {
                    if (boxToCircuit.get(junctionBoxIndex).equals(boxToCircuit.get(closestPair.boxIndex1))) {
                        newBoxToCircuit.set(junctionBoxIndex, boxToCircuit.get(closestPair.boxIndex2));
                    }
                }

                boxToCircuit = newBoxToCircuit;
            }
        }

        Map<Integer, Long> circuitSizes = new HashMap<>();
        for (int junctionBoxIndex = 0; junctionBoxIndex < nBoxes; junctionBoxIndex++) {
            int circuit = boxToCircuit.get(junctionBoxIndex);
            circuitSizes.put(circuit, circuitSizes.getOrDefault(circuit, 0L) + 1L);
        }

        List<Long> sortedSizes = new ArrayList<>(circuitSizes.values());
        Collections.sort(sortedSizes, Comparator.reverseOrder());

        return sortedSizes.get(0) * sortedSizes.get(1) * sortedSizes.get(2);
    }

    public static long continueConnecting(List<String> lines) {
        List<Vector> junctionBoxes = parseJunctionBoxes(lines);
        int nBoxes = junctionBoxes.size();
        List<JunctionBoxPair> closestPairs = findClosestPairs(junctionBoxes, 4000);
        List<Integer> boxToCircuit = IntStream.range(0, nBoxes)
            .boxed()
            .collect(Collectors.toList());

        for (JunctionBoxPair closestPair : closestPairs) {
            if (!boxToCircuit.get(closestPair.boxIndex1).equals(boxToCircuit.get(closestPair.boxIndex2))) {
                List<Integer> newBoxToCircuit = new ArrayList<>(boxToCircuit);

                for (int junctionBoxIndex = 0; junctionBoxIndex < nBoxes; junctionBoxIndex++) {
                    if (boxToCircuit.get(junctionBoxIndex).equals(boxToCircuit.get(closestPair.boxIndex1))) {
                        newBoxToCircuit.set(junctionBoxIndex, boxToCircuit.get(closestPair.boxIndex2));
                    }
                }

                boxToCircuit = newBoxToCircuit;

                Map<Integer, Long> circuitSizes = new HashMap<>();
                for (int junctionBoxIndex = 0; junctionBoxIndex < nBoxes; junctionBoxIndex++) {
                    int circuit = boxToCircuit.get(junctionBoxIndex);
                    circuitSizes.put(circuit, circuitSizes.getOrDefault(circuit, 0L) + 1L);
                }

                if (circuitSizes.size() == 1) {
                    return junctionBoxes.get(closestPair.boxIndex1).x * junctionBoxes.get(closestPair.boxIndex2).x;
                }
            }
        }

        throw new RuntimeException("Could not reach 1 circuit");
    }
}
