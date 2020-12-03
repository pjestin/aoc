

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day05Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day05-input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day05-input.txt"));
  }

  @Test
  public void getNbUnitsTest() {
    assertEquals(10, Day05.getNbUnits(inputTestLines.get(0)));
    assertEquals(11118, Day05.getNbUnits(inputLines.get(0)));
  }
}
