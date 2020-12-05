

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day08Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day08-input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day08-input.txt"));
  }

  @Test
  public void getMetadataSumTest() {
    assertEquals(138, Day08.getMetadataSum(inputTestLines.get(0)));
    assertEquals(40036, Day08.getMetadataSum(inputLines.get(0)));
  }

  @Test
  public void getNodeValueTest() {
    assertEquals(66, Day08.getNodeValue(inputTestLines.get(0)));
    assertEquals(21677, Day08.getNodeValue(inputLines.get(0)));
  }
}
