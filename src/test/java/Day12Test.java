import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day12Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day12", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day12", "input.txt"));
  }

  @Test
  public void getPlantChecksumAfterTwentyGenerationsTest() {
    assertEquals(325, Day12.getPlantChecksumAfterTwentyGenerations(inputTestLines));
    assertEquals(3120, Day12.getPlantChecksumAfterTwentyGenerations(inputLines));
  }
}
