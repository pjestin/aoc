import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day13Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day13", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day13", "input.txt"));
  }

  @Test
  public void getCrashCoordinatesTest() {
    assertEquals("7,3", Day13.getCrashCoordinates(inputTestLines));
    assertEquals("8,3", Day13.getCrashCoordinates(inputLines));
  }
}
