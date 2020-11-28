import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day02Test {
  private static List<String> inputLines, inputTestLines, inputTest2Lines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day02-input.txt"));
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day02-input-test.txt"));
    inputTest2Lines = FileUtils.readLines(Paths.get("src", "test", "resources", "day02-input-test-2.txt"));
  }

  @Test
  public void getChecksumTest() {
    assertEquals(12, Day02.getChecksum(inputTestLines));
    assertEquals(6370, Day02.getChecksum(inputLines));
  }

  @Test
  public void getBoxIdCommonLettersTest() {
    assertEquals("fgij", Day02.getBoxIdCommonLetters(inputTest2Lines));
    assertEquals("rmyxgdlihczskunpfijqcebtv", Day02.getBoxIdCommonLetters(inputLines));
  }
}
