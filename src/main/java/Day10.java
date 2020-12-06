import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.List;
import java.util.stream.Collectors;
import static java.lang.Integer.parseInt;

public class Day10 {
  private static class Star {
    public int x;
    public int y;
    public int dx;
    public int dy;

    public Star(int x, int y, int dx, int dy) {
      this.x = x;
      this.y = y;
      this.dx = dx;
      this.dy = dy;
    }

    private static final String PATTERN = "^position=< ?(-?\\d+),  ?(-?\\d+)> velocity=< ?(-?\\d+),  ?(-?\\d+)>$";

    public static Star parse(String line) {
      Pattern pattern = Pattern.compile(PATTERN);
      Matcher matcher = pattern.matcher(line);
      matcher.find();
      int x = parseInt(matcher.group(1));
      int y = parseInt(matcher.group(2));
      int dx = parseInt(matcher.group(3));
      int dy = parseInt(matcher.group(4));
      return new Star(x, y, dx, dy);
    }
  }

  private static List<Star> parseStars(List<String> lines) {
    return lines.stream().map(Star::parse).collect(Collectors.toList());
  }

  private static double getVariance(List<Star> stars) {
    double avgX = stars.parallelStream().map(star -> star.x).reduce(0, Integer::sum) / (double)stars.size();
    double avgY = stars.parallelStream().map(star -> star.y).reduce(0, Integer::sum) / (double)stars.size();
    double varX = stars.parallelStream().map(star -> Math.pow(star.x - avgX, 2)).reduce(0.0, Double::sum) / (double)stars.size();
    double varY = stars.parallelStream().map(star -> Math.pow(star.y - avgY, 2)).reduce(0.0, Double::sum) / (double)stars.size();
    return varX + varY;
  }

  public static int getMinVarianceStarConfigTime(List<String> lines) {
    List<Star> stars = parseStars(lines);
    double previousVariance = Double.POSITIVE_INFINITY;
    int time = 0;
    while (true) {
      stars.parallelStream().forEach(star -> {
        star.x += star.dx;
        star.y += star.dy;
      });
      double variance = getVariance(stars);
      if (variance > previousVariance) {
        break;
      }
      previousVariance = variance;
      time++;
    }
    return time;
  }

  private static List<Star> getMinVarianceStarConfig(List<String> lines) {
    int minVarianceTime = getMinVarianceStarConfigTime(lines);
    List<Star> stars = parseStars(lines);
    stars.parallelStream().forEach(star -> {
      star.x += minVarianceTime * star.dx;
      star.y += minVarianceTime * star.dy;
    });
    return stars;
  }

  public static String displayStarMessage(List<String> lines) {
    List<Star> stars = getMinVarianceStarConfig(lines);
    int minX = stars.parallelStream().map(star -> star.x).min(Integer::compare).get();
    int maxX = stars.parallelStream().map(star -> star.x).max(Integer::compare).get();
    int minY = stars.parallelStream().map(star -> star.y).min(Integer::compare).get();
    int maxY = stars.parallelStream().map(star -> star.y).max(Integer::compare).get();
    StringBuilder sb = new StringBuilder();
    for (int y = minY; y <= maxY; y++) {
      for (int x = minX; x <= maxX; x++) {
        sb.append(".");
      }
      sb.append("\n");
    }
    for (Star star : stars) {
      int index = (star.y - minY) * (maxX - minX + 2) + star.x - minX;
      sb.replace(index, index + 1, "#");
    }
    return sb.toString();
  }
}
