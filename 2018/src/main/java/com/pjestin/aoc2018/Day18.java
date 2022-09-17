package com.pjestin.aoc2018;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Day18 {
  private static class NeighbourCount {
    public int wooded = 0;
    public int lumberyard = 0;
  }

  private static List<List<Character>> parseGrid(List<String> lines) {
    List<List<Character>> grid = new ArrayList<>();
    for (String line : lines) {
      List<Character> row = new ArrayList<>();
      for (char c : line.toCharArray()) {
        row.add(c);
      }
      grid.add(row);
    }
    return grid;
  }

  private static NeighbourCount countNeighbours(List<List<Character>> grid, int x, int y) {
    NeighbourCount neighbourCount = new NeighbourCount();
    for (int dx = -1; dx <= 1; ++dx) {
      for (int dy = -1; dy <= 1; ++dy) {
        if ((dx == 0 && dy == 0) || x + dx < 0 || x + dx >= grid.get(0).size() || y + dy < 0 || y + dy >= grid.size()) {
          continue;
        }
        switch (grid.get(y + dy).get(x + dx)) {
          case '|':
            neighbourCount.wooded++;
            break;
          case '#':
            neighbourCount.lumberyard++;
            break;
        }
      }
    }
    return neighbourCount;
  }

  private static List<List<Character>> transform(List<List<Character>> grid) {
    List<List<Character>> newGrid = new ArrayList<>();
    for (int y = 0; y < grid.size(); ++y) {
      List<Character> row = new ArrayList<>();
      for (int x = 0; x < grid.get(0).size(); ++x) {
        NeighbourCount neighbourCount = countNeighbours(grid, x, y);
        switch (grid.get(y).get(x)) {
          case '.':
            if (neighbourCount.wooded >= 3) {
              row.add('|');
            } else {
              row.add('.');
            }
            break;
          case '|':
            if (neighbourCount.lumberyard >= 3) {
              row.add('#');
            } else {
              row.add('|');
            }
            break;
          case '#':
            if (neighbourCount.lumberyard >= 1 && neighbourCount.wooded >= 1) {
              row.add('#');
            } else {
              row.add('.');
            }
            break;
        }
      }
      newGrid.add(row);
    }
    return newGrid;
  }

  private static String getGridString(List<List<Character>> grid) {
    StringBuilder sb = new StringBuilder();
    for (List<Character> row : grid) {
      for (char c : row) {
        sb.append(c);
      }
    }
    return sb.toString();
  }

  private static int countAcres(List<List<Character>> grid, char charToCount) {
    int count = 0;
    for (List<Character> row : grid) {
      for (char c : row) {
        if (c == charToCount) {
          count++;
        }
      }
    }
    return count;
  }

  public static int countWoodedAndLumberyardAcres(List<String> lines, int nbCycles) {
    List<List<Character>> grid = parseGrid(lines);
    Map<String, Integer> gridStrings = new HashMap<>();
    int time = 0;
    while (time < nbCycles) {
      grid = transform(grid);
      String gridString = getGridString(grid);
      if (gridStrings.containsKey(gridString)) {
        int cycleLength = time - gridStrings.get(gridString);
        time += ((nbCycles - time) / cycleLength) * cycleLength;
      }
      gridStrings.put(gridString, time);
      ++time;
    }
    int nbWooded = countAcres(grid, '|');
    int nbLumberyard = countAcres(grid, '#');
    return nbWooded * nbLumberyard;
  }
}
