import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day10Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day10", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day10", "input.txt"));
  }

  @Test
  public void getWinningScoreTest() {
    String testMessage = "#...#..###\n"
                       + "#...#...#.\n"
                       + "#...#...#.\n"
                       + "#####...#.\n"
                       + "#...#...#.\n"
                       + "#...#...#.\n"
                       + "#...#...#.\n"
                       + "#...#..###\n";
    assertEquals(testMessage, Day10.displayStarMessage(inputTestLines));
    String message = "#####...#........####...#....#..#....#..#####......###...####.\n"
                   + "#....#..#.......#....#..##...#..#....#..#....#......#...#....#\n"
                   + "#....#..#.......#.......##...#..#....#..#....#......#...#.....\n"
                   + "#....#..#.......#.......#.#..#..#....#..#....#......#...#.....\n"
                   + "#####...#.......#.......#.#..#..######..#####.......#...#.....\n"
                   + "#....#..#.......#..###..#..#.#..#....#..#...........#...#.....\n"
                   + "#....#..#.......#....#..#..#.#..#....#..#...........#...#.....\n"
                   + "#....#..#.......#....#..#...##..#....#..#.......#...#...#.....\n"
                   + "#....#..#.......#...##..#...##..#....#..#.......#...#...#....#\n"
                   + "#####...######...###.#..#....#..#....#..#........###.....####.\n";
    assertEquals(message, Day10.displayStarMessage(inputLines));
  }

  @Test
  public void getMinVarianceStarConfigTimeTest() {
    assertEquals(3, Day10.getMinVarianceStarConfigTime(inputTestLines));
    assertEquals(10476, Day10.getMinVarianceStarConfigTime(inputLines));
  }
}
