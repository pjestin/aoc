import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day04Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day04-input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day04-input.txt"));
  }

  @Test
  public void getGuardIdMinuteProductStrategy1Test() {
    assertEquals(240, Day04.getGuardIdMinuteProductStrategy1(inputTestLines));
    assertEquals(99911, Day04.getGuardIdMinuteProductStrategy1(inputLines));
  }

  @Test
  public void getGuardIdMinuteProductStrategy2Test() {
    assertEquals(4455, Day04.getGuardIdMinuteProductStrategy2(inputTestLines));
    assertEquals(65854, Day04.getGuardIdMinuteProductStrategy2(inputLines));
  }
}
