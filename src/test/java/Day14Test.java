import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class Day14Test {
  @Test
  public void getNextTenScoresTest() {
    assertEquals(5158916779L, Day14.getNextTenScores(9));
    assertEquals(5941429882L, Day14.getNextTenScores(2018));
    assertEquals(3138510102L, Day14.getNextTenScores(637061));
  }

  @Test
  public void getNumberOfRecipesBeforeDigitsTest() {
    assertEquals(9, Day14.getNumberOfRecipesBeforeDigits(51589));
    assertEquals(2018, Day14.getNumberOfRecipesBeforeDigits(59414));
    assertEquals(20179081, Day14.getNumberOfRecipesBeforeDigits(637061));
  }
}
