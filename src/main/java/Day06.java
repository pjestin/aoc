import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.HashSet;
import java.util.Map;
import java.util.HashMap;
import java.lang.Integer;
import java.util.Collections;
import static java.lang.Integer.parseInt;

public class Day06 {
  private static class Boundaries {
    public int minX = Integer.MAX_VALUE;
    public int maxX = Integer.MIN_VALUE;
    public int minY = Integer.MAX_VALUE;
    public int maxY = Integer.MIN_VALUE;
  }

  private static List<Vector> parseLocations(List<String> lines) {
    List<Vector> locations = new ArrayList<>();
    for (String line : lines) {
      String[] values = line.split(",");
      locations.add(new Vector(parseInt(values[0].trim()), parseInt(values[1].trim())));
    }
    return locations;
  }

  private static String getPositionHash(int x, int y) {
    return String.format("%d;%d", x, y);
  }

  private static Boundaries findBoundaries(List<Vector> positions) {
    Boundaries boundaries = new Boundaries();
    for (Vector position : positions) {
      boundaries.minX = Math.min(boundaries.minX, position.x - 1);
      boundaries.maxX = Math.max(boundaries.maxX, position.x + 1);
      boundaries.minY = Math.min(boundaries.minY, position.y - 1);
      boundaries.maxY = Math.max(boundaries.maxY, position.y + 1);
    }
    return boundaries;
  }

  private static Map<String, Integer> findClosestLocations(Boundaries boundaries, List<Vector> locations) {
    Map<String, Integer> closestLocations = new HashMap<>();
    for (int x = boundaries.minX; x <= boundaries.maxX; x++) {
      for (int y = boundaries.minY; y <= boundaries.maxY; y++) {
        int minDistance = Integer.MAX_VALUE;
        int minLocationIndex = 0;
        for (int locationIndex = 0; locationIndex < locations.size(); locationIndex++) {
          Vector location = locations.get(locationIndex);
          int distance = Math.abs(location.x - x) + Math.abs(location.y - y);
          if (distance < minDistance) {
            minDistance = distance;
            minLocationIndex = locationIndex;
          } else if (distance == minDistance) {
            minLocationIndex = -1;
          }
        }
        closestLocations.put(getPositionHash(x, y), minLocationIndex);
      }
    }
    return closestLocations;
  }

  private static Set<Integer> findInifiniteAreaLocationIndices(Boundaries boundaries, Map<String, Integer> closestLocations) {
    Set<Integer> infiniteAreaLocationIndices = new HashSet<>();
    for (int x = boundaries.minX + 1; x < boundaries.maxX; x++) {
      infiniteAreaLocationIndices.add(closestLocations.get(getPositionHash(x, boundaries.minY)));
      infiniteAreaLocationIndices.add(closestLocations.get(getPositionHash(x, boundaries.maxY)));
    }
    for (int y = boundaries.minY; y <= boundaries.maxY; y++) {
      infiniteAreaLocationIndices.add(closestLocations.get(getPositionHash(boundaries.minX, y)));
      infiniteAreaLocationIndices.add(closestLocations.get(getPositionHash(boundaries.maxX, y)));
    }
    return infiniteAreaLocationIndices;
  }

  public static int findMaxArea(Map<String, Integer> closestLocations, Set<Integer> infiniteAreaLocationIndices) {
    Map<Integer, Integer> areaCounts = new HashMap<>();
    for (int locationIndex : closestLocations.values()) {
      if (locationIndex == -1 || infiniteAreaLocationIndices.contains(locationIndex)) {
        continue;
      }
      areaCounts.put(locationIndex, areaCounts.getOrDefault(locationIndex, 0) + 1);
    }
    return Collections.max(areaCounts.values());
  }

  public static int countRegionArea(List<Vector> locations, Boundaries boundaries, int maxDistanceSum) {
    int areaCount = 0;
    for (int x = boundaries.minX; x <= boundaries.maxX; x++) {
      for (int y = boundaries.minY; y <= boundaries.maxY; y++) {
        int distanceSum = 0;
        for (Vector location : locations) {
          distanceSum += Math.abs(location.x - x) + Math.abs(location.y - y);
        }
        if (distanceSum < maxDistanceSum) {
          areaCount++;
        }
      }
    }
    return areaCount;
  }

  public static int getMaxFiniteArea(List<String> lines) {
    List<Vector> locations = parseLocations(lines);
    Boundaries boundaries = findBoundaries(locations);
    Map<String, Integer> closestLocations = findClosestLocations(boundaries, locations);
    Set<Integer> infiniteAreaLocationIndices = findInifiniteAreaLocationIndices(boundaries, closestLocations);
    return findMaxArea(closestLocations, infiniteAreaLocationIndices);
  }

  public static int getRegionArea(List<String> lines, int maxDistanceSum) {
    List<Vector> locations = parseLocations(lines);
    Boundaries boundaries = findBoundaries(locations);
    return countRegionArea(locations, boundaries, maxDistanceSum);
  }
}
