import java.util.List;
import java.util.LinkedList;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import static java.lang.Integer.parseInt;

public class Day03 {

  private static class Claim {
    public int id, x, y, width, height;

    public Claim(int id, int x, int y, int width, int height) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }

    public List<String> getSquareHashes() {
      List<String> squareHashes = new LinkedList<>();
      for (int i = x; i < x + width; i++) {
        for (int j = y; j < y + height; j++) {
          squareHashes.add(String.format("%d;%d", i, j));
        }
      }
      return squareHashes;
    }

    public boolean overlaps(Claim other) {
      return other.x + other.width > x && x + width > other.x
        && other.y + other.height > y && y + height > other.y;
    }
  }

  private static final String PATTERN = "^#(\\d+) @ (\\d+),(\\d+): (\\d+)x(\\d+)$";

  private static List<Claim> getClaimsFromLines(List<String> lines) {
    Pattern pattern = Pattern.compile(PATTERN);
    List<Claim> claims = new LinkedList<>();
    for (String line : lines) {
      Matcher matcher = pattern.matcher(line);
      matcher.find();
      claims.add(new Claim(
        parseInt(matcher.group(1)),
        parseInt(matcher.group(2)),
        parseInt(matcher.group(3)),
        parseInt(matcher.group(4)),
        parseInt(matcher.group(5))
      ));
    }
    return claims;
  }

  private static Map<String, Integer> getSquareClaimCounts(List<Claim> claims) {
    Map<String, Integer> counts = new HashMap<>();
    for (Claim claim : claims) {
      List<String> squareHashes = claim.getSquareHashes();
      for (String squareHash : squareHashes) {
        counts.put(squareHash, counts.getOrDefault(squareHash, 0) + 1);
      }
    }
    return counts;
  }

  public static int getNbOverlappingClaims(List<String> lines) {
    List<Claim> claims = getClaimsFromLines(lines);
    Map<String, Integer> counts = getSquareClaimCounts(claims);
    int overlapCount = 0;
    for (int countValue : counts.values()) {
      if (countValue > 1) {
        overlapCount++;
      }
    }
    return overlapCount;
  }

  public static int getNonOverlappingClaimId(List<String> lines) {
    List<Claim> claims = getClaimsFromLines(lines);
    for (int i = 0; i < claims.size(); i++) {
      boolean foundOverlap = false;
      Claim claim = claims.get(i);
      for (int j = 0; j < claims.size(); j++) {
        if (i != j && claim.overlaps(claims.get(j))) {
          foundOverlap = true;
          break;
        }
      }
      if (!foundOverlap) {
        return claim.id;
      }
    }
    return -1;
  }
}
