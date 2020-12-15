import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class Day17 {
  private static final Pattern PATTERN = Pattern.compile("^([xy])=(\\d+), [xy]=(\\d+)\\.\\.(\\d+)$");

  private static Set<Vector> parseClay(List<String> lines) {
    Set<Vector> clayTiles = new HashSet<>();
    for (String line : lines) {
      Matcher matcher = PATTERN.matcher(line);
      if (matcher.find()) {
        int value1 = Integer.valueOf(matcher.group(2));
        int value2 = Integer.valueOf(matcher.group(3));
        int value3 = Integer.valueOf(matcher.group(4));
        for (int i = value2; i <= value3; i++) {
          if ("x".equals(matcher.group(1))) {
            clayTiles.add(new Vector(value1, i));
          } else {
            clayTiles.add(new Vector(i, value1));
          }
        }
      }
    }
    return clayTiles;
  }

  private static boolean isOccupied(Vector position, Set<Vector> clayTiles, Set<Vector> waterTiles) {
    return clayTiles.contains(position) || waterTiles.contains(position);
  }

  private static void fill(Vector position, Set<Vector> clayTiles, Set<Vector> waterTiles, Set<Vector> driedTiles, int minY, int maxY) {
    if (position.y > maxY || position.y < minY || isOccupied(position, clayTiles, waterTiles)) {
      return;
    }
    Vector exploreLeft = new Vector(position);
    while (!isOccupied(new Vector(exploreLeft.x - 1, exploreLeft.y), clayTiles, waterTiles)
        && isOccupied(new Vector(exploreLeft.x - 1, exploreLeft.y + 1), clayTiles, waterTiles)) {
      driedTiles.add(new Vector(exploreLeft));
      exploreLeft.x--;
    }
    driedTiles.add(new Vector(exploreLeft));
    boolean boundaryOnLeft = isOccupied(new Vector(exploreLeft.x - 1, exploreLeft.y), clayTiles, waterTiles);

    Vector exploreRight = new Vector(position);
    while (!isOccupied(new Vector(exploreRight.x + 1, exploreRight.y), clayTiles, waterTiles)
        && isOccupied(new Vector(exploreRight.x + 1, exploreRight.y + 1), clayTiles, waterTiles)) {
          driedTiles.add(new Vector(exploreRight));
      exploreRight.x++;
    }
    driedTiles.add(new Vector(exploreRight));
    boolean boundaryOnRight = isOccupied(new Vector(exploreRight.x + 1, exploreRight.y), clayTiles, waterTiles);

    if (boundaryOnLeft && boundaryOnRight) {
      for (int x = exploreLeft.x; x <= exploreRight.x; x++) {
        waterTiles.add(new Vector(x, position.y));
      }
      fill(new Vector(position.x, position.y - 1), clayTiles, waterTiles, driedTiles, minY, maxY);
    } else {
      if (!boundaryOnLeft) {
        explore(new Vector(exploreLeft.x - 1, exploreLeft.y), clayTiles, waterTiles, driedTiles, minY, maxY);
      }
      if (!boundaryOnRight) {
        explore(new Vector(exploreRight.x + 1, exploreRight.y), clayTiles, waterTiles, driedTiles, minY, maxY);
      }
    }
  }

  private static void explore(Vector position, Set<Vector> clayTiles, Set<Vector> waterTiles, Set<Vector> driedTiles, int minY, int maxY) {
    if (isOccupied(position, clayTiles, waterTiles)) {
      return;
    }
    while (!isOccupied(new Vector(position.x, position.y + 1), clayTiles, waterTiles)) {
      if (position.y > maxY || position.y < 0 || driedTiles.contains(position)) {
        return;
      }
      if (position.y >= minY) {
        driedTiles.add(new Vector(position));
      }
      position.y++;
    }
    driedTiles.add(new Vector(position));
    fill(position, clayTiles, waterTiles, driedTiles, minY, maxY);
  }

  public static int countWaterReachableTiles(List<String> lines) {
    Set<Vector> clayTiles = parseClay(lines);
    Set<Vector> waterTiles = new HashSet<>();
    Set<Vector> driedTiles = new HashSet<>();
    Vector position = new Vector(500, 0);
    int minY = clayTiles.parallelStream().map(clay -> clay.y).min(Integer::compare).get();
    int maxY = clayTiles.parallelStream().map(clay -> clay.y).max(Integer::compare).get();
    explore(position, clayTiles, waterTiles, driedTiles, minY, maxY);
    waterTiles.addAll(driedTiles);
    return waterTiles.size();
  }

  public static int countPersistingWaterTiles(List<String> lines) {
    Set<Vector> clayTiles = parseClay(lines);
    Set<Vector> waterTiles = new HashSet<>();
    Set<Vector> driedTiles = new HashSet<>();
    Vector position = new Vector(500, 0);
    int minY = clayTiles.parallelStream().map(clay -> clay.y).min(Integer::compare).get();
    int maxY = clayTiles.parallelStream().map(clay -> clay.y).max(Integer::compare).get();
    explore(position, clayTiles, waterTiles, driedTiles, minY, maxY);
    return waterTiles.size();
  }
}
