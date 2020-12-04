

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day06Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day06-input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day06-input.txt"));
  }

  @Test
  public void getMaxFiniteAreaTest() {
    assertEquals(17, Day06.getMaxFiniteArea(inputTestLines));
    assertEquals(4771, Day06.getMaxFiniteArea(inputLines));
  }

  @Test
  public void getRegionAreaTest() {
    assertEquals(16, Day06.getRegionArea(inputTestLines, 32));
    assertEquals(39149, Day06.getRegionArea(inputLines, 10000));
  }
}
