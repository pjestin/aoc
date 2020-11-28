import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import java.nio.file.Paths;
import java.io.FileNotFoundException;
import java.util.List;

public class Day03Test {
  private static List<String> inputTestLines, inputLines;

  @BeforeAll
  public static void setUp() throws FileNotFoundException {
    inputTestLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day03-input-test.txt"));
    inputLines = FileUtils.readLines(Paths.get("src", "test", "resources", "day03-input.txt"));
  }

  @Test
  public void getNbOverlappingClaimsTest() {
    assertEquals(4, Day03.getNbOverlappingClaims(inputTestLines));
    assertEquals(110389, Day03.getNbOverlappingClaims(inputLines));
  }

  @Test
  public void getNonOverlappingClaimIdTest() {
    assertEquals(3, Day03.getNonOverlappingClaimId(inputTestLines));
    assertEquals(552, Day03.getNonOverlappingClaimId(inputLines));
  }
}
