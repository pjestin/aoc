package com.pjestin.aoc2025;

import java.util.AbstractMap;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class Day11 {
    private static Map<String, Set<String>> parseGraph(List<String> lines) {
        return lines.stream().map(line -> {
            String[] splitLine = line.split(": ");
            String origin = splitLine[0];
            Set<String> destinations = new HashSet<>(Arrays.asList(splitLine[1].split(" ")));
            return new AbstractMap.SimpleEntry<>(origin, destinations);
        }).collect(Collectors.toMap(entry -> entry.getKey(), entry -> entry.getValue()));
    }

    public static int countPathsFromYou(List<String> lines) {
        Map<String, Set<String>> graph = parseGraph(lines);

        LinkedList<String> queue = new LinkedList<>();
        queue.add("you");
        int pathCount = 0;

        while (!queue.isEmpty()) {
            String device = queue.remove();

            if ("out".equals(device)) {
                pathCount++;
                continue;
            }

            if (!graph.containsKey(device)) {
                continue;
            }

            for (String destination : graph.get(device)) {
                queue.add(destination);
            }
        }

        return pathCount;
    }

    private static long countPathsFromDevice(Map<String, Set<String>> graph, String device, boolean dacPassed, boolean fftPassed, Map<String, Long> cache) {
        if ("out".equals(device)) {
            return dacPassed && fftPassed ? 1L : 0L;
        }

        String cacheKey = device + (dacPassed ? "1" : "0") + (fftPassed ? "1" : "0");
        if (cache.containsKey(cacheKey)) {
            return cache.get(cacheKey);
        }

        if ("dac".equals(device)) {
            dacPassed = true;
        }

        if ("fft".equals(device)) {
            fftPassed = true;
        }

        long pathCount = 0L;
        for (String destination : graph.get(device)) {
            pathCount += countPathsFromDevice(graph, destination, dacPassed, fftPassed, cache);
        }

        cache.put(cacheKey, pathCount);
        return pathCount;
    }

    public static long countPathsFromSvr(List<String> lines) {
        Map<String, Set<String>> graph = parseGraph(lines);
        Map<String, Long> cache = new HashMap<>();

        return countPathsFromDevice(graph, "svr", false, false, cache);
    }
}
