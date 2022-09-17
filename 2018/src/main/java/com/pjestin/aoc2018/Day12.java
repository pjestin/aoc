package com.pjestin.aoc2018;

import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.LongStream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Day12 {
  private static class State {
    public String pots;
    public long offset = 0;
    public long generation = 0;

    public State(String pots) {
      this.pots = pots;
    }

    public State(State other) {
      this.pots = other.pots;
      this.offset = other.offset;
      this.generation = other.generation;
    }
  }

  private static String parsePotString(List<String> lines) {
    return lines.get(0).split(": ")[1];
  }

  private static Set<String> parseRuleSet(List<String> lines) {
    Set<String> ruleSet = new HashSet<>();
    for (int i = 2; i < lines.size(); i++) {
      String[] rule = lines.get(i).split(" => ");
      if (rule[1].charAt(0) == '#') {
        ruleSet.add(rule[0]);
      }
    }
    return ruleSet;
  }

  private static final Pattern PATTERN = Pattern.compile("^(\\.*)(#.*#)\\.*$");

  private static void runGeneration(State state, Set<String> ruleSet) {
    StringBuilder nextPotStringBuilder = new StringBuilder(String.format("..%s..", state.pots));
    String potString = String.format("....%s....", state.pots);
    for (int i = 0; i < potString.length() - 4; i++) {
      boolean willHavePlant = ruleSet.contains(potString.substring(i, i + 5));
      nextPotStringBuilder.replace(i, i + 1, willHavePlant ? "#" : ".");
    }
    String nextPotString = nextPotStringBuilder.toString();
    Matcher matcher = PATTERN.matcher(nextPotString);
    matcher.find();
    state.pots = matcher.group(2);
    state.offset += matcher.group(1).length() - 2;
    state.generation++;
  }

  public static long getPlantChecksumAfterGenerations(List<String> lines, long nbGenerations) {
    String potString = parsePotString(lines);
    Set<String> ruleSet = parseRuleSet(lines);
    Map<String, State> visitedPotStates = new HashMap<>();
    State state = new State(potString);
    while (state.generation < nbGenerations) {
      runGeneration(state, ruleSet);
      if (visitedPotStates.containsKey(state.pots)) {
        State previousState = visitedPotStates.get(state.pots);
        long generationGap = state.generation - previousState.generation;
        long offsetGap = state.offset - previousState.offset;
        long fastForward = (nbGenerations - state.generation) / generationGap;
        state.generation += fastForward * generationGap;
        state.offset += fastForward * offsetGap;
      }
      visitedPotStates.put(state.pots, new State(state));
    }
    final String finalPotString = state.pots;
    return LongStream.range(0, state.pots.length())
      .filter(potNumber -> finalPotString.charAt((int)potNumber) == '#')
      .map(potNumber -> potNumber + state.offset)
      .reduce(0, Long::sum);
  }
}
