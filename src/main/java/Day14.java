import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.stream.Collectors;

public class Day14 {
  private static long getCombinedScoreFromSubList(List<Integer> recipeRatings, int begin, int end) {
    long score = 0;
    for (int i = begin; i < end; i++) {
      score = recipeRatings.get(i) + 10 * score;
    }
    return score;
  }

  private static void addNewRecipes(List<Integer> recipeRatings, List<Integer> elfIndices) {
    int combinedRecipeRating = elfIndices
      .stream()
      .map(index -> recipeRatings.get(index))
      .reduce(0, Integer::sum);
    if (combinedRecipeRating >= 10) {
      recipeRatings.add(combinedRecipeRating / 10);
    }
    recipeRatings.add(combinedRecipeRating % 10);
  }

  private static List<Integer> getNewElvesIndices(List<Integer> recipeRatings, List<Integer> elfIndices) {
    return elfIndices
      .stream()
      .map(index -> (index + recipeRatings.get(index) + 1) % recipeRatings.size())
      .collect(Collectors.toList());
  }

  public static long getNextTenScores(int nbRecipes) {
    List<Integer> recipeRatings = new ArrayList<>(Arrays.asList(3, 7));
    List<Integer> elfIndices = Arrays.asList(0, 1);
    while (recipeRatings.size() < nbRecipes + 10) {
      addNewRecipes(recipeRatings, elfIndices);
      elfIndices = getNewElvesIndices(recipeRatings, elfIndices);
    }
    return getCombinedScoreFromSubList(recipeRatings, nbRecipes, nbRecipes + 10);
  }

  public static int getNumberOfRecipesBeforeDigits(int digits) {
    int nDigits = String.valueOf(digits).length();
    List<Integer> recipeRatings = new ArrayList<>(Arrays.asList(3, 7));
    List<Integer> elfIndices = Arrays.asList(0, 1);
    int previousCheckIndex = -1;
    while (true) {
      for (int checkIndex = previousCheckIndex + 1; checkIndex < recipeRatings.size() - nDigits; checkIndex++) {
        if (getCombinedScoreFromSubList(recipeRatings, checkIndex, checkIndex + nDigits) == digits) {
          return checkIndex;
        }
        previousCheckIndex = checkIndex;
      }
      addNewRecipes(recipeRatings, elfIndices);
      elfIndices = getNewElvesIndices(recipeRatings, elfIndices);
    }
  }
}
