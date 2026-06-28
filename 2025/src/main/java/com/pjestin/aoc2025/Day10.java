package com.pjestin.aoc2025;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;

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
            List<Integer> cache = new ArrayList<>();

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

        private double[][] buildMatrix() {
            int L = joltageRequirements.size();
            int B = buttons.size();
            double[][] A = new double[L][B];
            for (int i = 0; i < L; i++) {
                double[] row = new double[B];
                for (int k = 0; k < B; k++) {
                    if (buttons.get(k).contains(i)) {
                        row[k] = 1.0;
                    }
                }
                A[i] = row;
            }

            return A;
        }

        public int countJoltageFewestPushes() {
            double[][] A = buildMatrix();
            double[] b = joltageRequirements.stream().mapToDouble(i -> i).toArray();

            MPSolver solver = new MPSolver("MinimalSumSolver", MPSolver.OptimizationProblemType.CBC_MIXED_INTEGER_PROGRAMMING);

            int numVars = A[0].length;
            MPVariable[] x = new MPVariable[numVars];
            for (int i = 0; i < numVars; i++) {
                x[i] = solver.makeIntVar(0, solver.infinity(), "x" + i);
            }

            MPObjective objective = solver.objective();
            for (MPVariable var : x) {
                objective.setCoefficient(var, 1);
            }
            objective.setMinimization();

            for (int i = 0; i < A.length; i++) {
                MPConstraint constraint = solver.makeConstraint(b[i], b[i], "constraint" + i);
                for (int j = 0; j < A[i].length; j++) {
                    constraint.setCoefficient(x[j], A[i][j]);
                }
            }

            // Solve the problem
            MPSolver.ResultStatus resultStatus = solver.solve();

            // Print the solution
            if (resultStatus == MPSolver.ResultStatus.OPTIMAL) {
                System.out.println("Solution:");
                for (MPVariable var : x) {
                    System.out.print((int) var.solutionValue() + " ");
                }
                return (int) objective.value();
            }

            throw new RuntimeException("Could not reach target joltages");
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
            .map(Machine::countIndicatorLightFewestPushes)
            .mapToInt(i -> i)
            .sum();
    }

    public static int countJoltageFewestPushes(List<String> lines) {
        Loader.loadNativeLibraries();
        List<Machine> machines = parseMachines(lines);

        return machines.stream()
            .map(Machine::countJoltageFewestPushes)
            .mapToInt(i -> i)
            .sum();
    }
}
