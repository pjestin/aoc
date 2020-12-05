

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day07Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day07", "input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day07", "input.txt"));
  }

  @Test
  public void getTaskOrderTest() {
    assertEquals("CABDFE", Day07.getTaskOrder(inputTestLines));
    assertEquals("CFGHAEMNBPRDISVWQUZJYTKLOX", Day07.getTaskOrder(inputLines));
  }

  @Test
  public void getTotalTaskTimeWithWorkersTest() {
    assertEquals(15, Day07.getTotalTaskTimeWithWorkers(inputTestLines, 0, 2));
    assertEquals(828, Day07.getTotalTaskTimeWithWorkers(inputLines, 60, 5));
  }
}
