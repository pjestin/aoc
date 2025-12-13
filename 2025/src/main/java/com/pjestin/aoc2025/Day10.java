package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class Day10 {
    private static class Machine {
        int targetIndicatorLights = 0;
        List<Set<Integer>> buttons = new ArrayList<>();
        List<Integer> joltageRequirements = new ArrayList<>();

        public Machine(int targetIndicatorLights, List<Set<Integer>> buttons, List<Integer> joltageRequirements) {
            this.targetIndicatorLights = targetIndicatorLights;
            this.buttons = buttons;
            this.joltageRequirements = joltageRequirements;
        }

        private record IndicatorLightState(int pushes, int indicatorLights) {}

        public int countIndicatorLightFewestPushes() {
            LinkedList<IndicatorLightState> queue = new LinkedList<>();
            queue.add(new IndicatorLightState(0, 0));
            Set<Integer> cache = new HashSet<>();

            while (!queue.isEmpty()) {
                IndicatorLightState state = queue.remove();

                if (state.indicatorLights == this.targetIndicatorLights) {
                    return state.pushes;
                } else if (cache.contains(state.indicatorLights)) {
                    continue;
                }

                cache.add(state.indicatorLights);

                for (Set<Integer> button : this.buttons) {
                    int newIndicatorLights = state.indicatorLights;
                    for (int light : button) {
                        newIndicatorLights ^= 1 << light;
                    }
                    queue.add(new IndicatorLightState(state.pushes + 1, newIndicatorLights));
                }
            }

            throw new RuntimeException("Could not reach target indicator lights");
        }

        public List<Set<Integer>> buildLastMentions() {
            List<Set<Integer>> lastMentions = new ArrayList<>();
            for (int buttonIndex = 0; buttonIndex < this.buttons.size(); buttonIndex++) {
                lastMentions.add(new HashSet<>());
            }

            for (int joltageIndex = 0; joltageIndex < this.joltageRequirements.size(); joltageIndex++) {
                int lastMention = 0;

                for (int buttonIndex = 0; buttonIndex < this.buttons.size(); buttonIndex++) {
                    if (this.buttons.get(buttonIndex).contains(joltageIndex)) {
                        lastMention = buttonIndex;
                    }
                }

                lastMentions.get(lastMention).add(joltageIndex);
            }

            return lastMentions;
        }

        private Optional<Integer> getForcedPushCount(int buttonIndex, List<Integer> joltages, Set<Integer> lastMentions) {
            Set<Integer> candidates = lastMentions.stream()
                .map(lastMention -> this.joltageRequirements.get(lastMention) - joltages.get(lastMention))
                .collect(Collectors.toSet());

            if (candidates.size() != 1) {
                return Optional.empty();
            } else {
                return Optional.of(candidates.iterator().next());
            }
        }

        private boolean isStillValid(List<Integer> joltages) {
            for (int joltageIndex = 0; joltageIndex < joltages.size(); joltageIndex++) {
                if (joltages.get(joltageIndex) > this.joltageRequirements.get(joltageIndex)) {
                    return false;
                }
            }

            return true;
        }

        public Optional<Integer> countJoltageFewestPushes(int buttonIndex, List<Integer> joltages, List<Set<Integer>> lastMentions) {
            if (buttonIndex >= this.buttons.size()) {
                if (joltages.equals(this.joltageRequirements)) {
                    return Optional.of(0);
                } else {
                    return Optional.empty();
                }
            }

            if (!lastMentions.get(buttonIndex).isEmpty()) {
                Optional<Integer> forcedPushCount = this.getForcedPushCount(buttonIndex, joltages, lastMentions.get(buttonIndex));
                if (forcedPushCount.isEmpty()) {
                    return Optional.empty();
                } else {
                    for (int joltageIndex : this.buttons.get(buttonIndex)) {
                        joltages.set(joltageIndex, joltages.get(joltageIndex) + forcedPushCount.get());
                    }
                    if (this.isStillValid(joltages)) {
                        Optional<Integer> downstreamFewestPushes = this.countJoltageFewestPushes(buttonIndex + 1, joltages, lastMentions);
                        for (int joltageIndex : this.buttons.get(buttonIndex)) {
                            joltages.set(joltageIndex, joltages.get(joltageIndex) - forcedPushCount.get());
                        }
                        if (downstreamFewestPushes.isPresent()) {
                            return Optional.of(downstreamFewestPushes.get() + forcedPushCount.get());
                        } else {
                            return Optional.empty();
                        }
                    } else {
                        for (int joltageIndex : this.buttons.get(buttonIndex)) {
                            joltages.set(joltageIndex, joltages.get(joltageIndex) - forcedPushCount.get());
                        }
                        return Optional.empty();
                    }
                }
            }

            Optional<Integer> fewestPushes = Optional.empty();
            int pushCount = 0;

            while (true) {
                for (int joltageIndex : this.buttons.get(buttonIndex)) {
                    joltages.set(joltageIndex, joltages.get(joltageIndex) + pushCount);
                }

                if (!isStillValid(joltages)) {
                    for (int joltageIndex : this.buttons.get(buttonIndex)) {
                        joltages.set(joltageIndex, joltages.get(joltageIndex) - pushCount);
                    }
                    break;
                }

                Optional<Integer> downstreamFewestPushes = this.countJoltageFewestPushes(buttonIndex + 1, joltages, lastMentions);

                if (downstreamFewestPushes.isPresent()) {
                    if (fewestPushes.isPresent()) {
                        fewestPushes = Optional.of(Math.min(downstreamFewestPushes.get() + pushCount, fewestPushes.get()));
                    } else {
                        fewestPushes = Optional.of(downstreamFewestPushes.get() + pushCount);
                    }
                }

                for (int joltageIndex : this.buttons.get(buttonIndex)) {
                    joltages.set(joltageIndex, joltages.get(joltageIndex) - pushCount);
                }

                pushCount++;
            }

            return fewestPushes;
        }
    }

    private static List<Machine> parseMachines(List<String> lines) {
        return lines.stream().map(line -> {
            String[] splitLine = line.split(" ");

            String indicatorLightString = splitLine[0].substring(1, splitLine[0].length() - 1);
            int targetIndicatorLights = 0;
            for (int i = 0; i < indicatorLightString.length(); i++) {
                if (indicatorLightString.charAt(i) == '#') {
                    targetIndicatorLights |= 1 << i;
                }
            }

            List<Set<Integer>> buttons = new ArrayList<>();
            for (int i = 1; i < splitLine.length - 1; i++) {
                String buttonString = splitLine[i].substring(1, splitLine[i].length() - 1);
                Set<Integer> button = Arrays.stream(buttonString.split(",")).map(Integer::parseInt).collect(Collectors.toSet());
                buttons.add(button);
            }

            String joltageRequirementString = splitLine[splitLine.length - 1];
            String[] splitJoltageRequirements = joltageRequirementString.substring(1, joltageRequirementString.length() - 1).split(",");
            List<Integer> joltageRequirements = Arrays.stream(splitJoltageRequirements).map(Integer::parseInt).collect(Collectors.toList());

            return new Machine(targetIndicatorLights, buttons, joltageRequirements);
        }).collect(Collectors.toList());
    }

    public static int countIndicatorLightFewestPushes(List<String> lines) {
        List<Machine> machines = parseMachines(lines);

        return machines.stream()
            .map(machine -> machine.countIndicatorLightFewestPushes())
            .reduce(0, (acc, count) -> acc + count);
    }

    public static int countJoltageFewestPushes(List<String> lines) {
        List<Machine> machines = parseMachines(lines);

        return machines.stream()
            .map(machine -> {
                int fewestPushes = machine.countJoltageFewestPushes(0, new ArrayList<>(Collections.nCopies(machine.joltageRequirements.size(), 0)), machine.buildLastMentions()).get();
                System.out.println(fewestPushes);
                return fewestPushes;
            })
            .reduce(0, (acc, fewestPushes) -> acc + fewestPushes);
    }
}
