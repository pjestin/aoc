package com.pjestin.aoc2018;

public class Day11 {
  private static final int GRID_SIZE = 300;

  private static int[][] getPowerLevels(int gridSerialNumber) {
    int[][] powerLevels = new int[GRID_SIZE][GRID_SIZE];
    for (int x = 1; x <= GRID_SIZE; x++) {
      for (int y = 1; y <= GRID_SIZE; y++) {
        int rackId = x + 10;
        int powerLevel = (((rackId * y + gridSerialNumber) * rackId) / 100) % 10 - 5;
        powerLevels[x - 1][y - 1] = powerLevel;
      }
    }
    return powerLevels;
  }

  public static String getMaxPowerLevelSquareCoordinates(int gridSerialNumber) {
    int[][] powerLevels = getPowerLevels(gridSerialNumber);
    int maxPowerLevel = 0;
    int maxPowerLevelX = 1;
    int maxPowerLevelY = 1;
    for (int x = 1; x <= GRID_SIZE - 3; x++) {
      for (int y = 1; y <= GRID_SIZE - 3; y++) {
        int powerLevel = 0;
        for (int i = 0; i < 3; i++) {
          for (int j = 0; j < 3; j++) {
            powerLevel += powerLevels[x + i - 1][y + j - 1];
          }
        }
        if (powerLevel > maxPowerLevel) {
          maxPowerLevel = powerLevel;
          maxPowerLevelX = x;
          maxPowerLevelY = y;
        }
      }
    }
    return String.format("%d,%d", maxPowerLevelX, maxPowerLevelY);
  }

  public static String getMaxPowerLevelCoordinatesAndSize(int gridSerialNumber) {
    int[][] powerLevels = getPowerLevels(gridSerialNumber);
    int maxPowerLevel = 0;
    int maxPowerLevelX = 1;
    int maxPowerLevelY = 1;
    int maxPowerLevelSize = 1;
    for (int x = 1; x <= GRID_SIZE; x++) {
      for (int y = 1; y <= GRID_SIZE; y++) {
        int powerLevel = 0;
        for (int size = 1; size <= GRID_SIZE - Math.max(x, y) + 1; size++) {
          for (int i = 1; i < size; i++) {
            powerLevel += powerLevels[x + i - 2][y + size - 2];
            powerLevel += powerLevels[x + size - 2][y + i - 2];
          }
          powerLevel += powerLevels[x + size - 2][y + size - 2];
          if (powerLevel > maxPowerLevel) {
            maxPowerLevel = powerLevel;
            maxPowerLevelX = x;
            maxPowerLevelY = y;
            maxPowerLevelSize = size;
          }
        }
      }
    }
    return String.format("%d,%d,%d", maxPowerLevelX, maxPowerLevelY, maxPowerLevelSize);
  }
}
