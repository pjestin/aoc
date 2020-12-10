import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

public class Day14 {
  private static long getCombinedScoreFromSubList(List<Integer> recipeRatings, int begin, int end) {
    long score = 0;
    for (int i = begin; i < end; i++) {
      score = recipeRatings.get(i) + 10 * score;
    }
    return score;
  }

  private static void addNewRecipes(List<Integer> recipeRatings, int[] elfIndices) {
    int combinedRecipeRating = 0;
    for (int i = 0; i < elfIndices.length; i++) {
      combinedRecipeRating += recipeRatings.get(elfIndices[i]);
    }
    if (combinedRecipeRating >= 10) {
      recipeRatings.add(combinedRecipeRating / 10);
    }
    recipeRatings.add(combinedRecipeRating % 10);
  }

  private static void moveElves(List<Integer> recipeRatings, int[] elfIndices) {
    for (int i = 0; i < elfIndices.length; i++) {
      elfIndices[i] = (elfIndices[i] + recipeRatings.get(elfIndices[i]) + 1) % recipeRatings.size();
    }
  }

  public static long getNextTenScores(int nbRecipes) {
    List<Integer> recipeRatings = new ArrayList<>(Arrays.asList(3, 7));
    int[] elfIndices = new int[]{0, 1};
    while (recipeRatings.size() < nbRecipes + 10) {
      addNewRecipes(recipeRatings, elfIndices);
      moveElves(recipeRatings, elfIndices);
    }
    return getCombinedScoreFromSubList(recipeRatings, nbRecipes, nbRecipes + 10);
  }

  public static int getNumberOfRecipesBeforeDigits(int digits) {
    int nDigits = String.valueOf(digits).length();
    List<Integer> recipeRatings = new ArrayList<>(Arrays.asList(3, 7));
    int[] elfIndices = new int[]{0, 1};
    int previousCheckIndex = -1;
    while (true) {
      for (int checkIndex = previousCheckIndex + 1; checkIndex < recipeRatings.size() - nDigits; checkIndex++) {
        if (getCombinedScoreFromSubList(recipeRatings, checkIndex, checkIndex + nDigits) == digits) {
          return checkIndex;
        }
        previousCheckIndex = checkIndex;
      }
      addNewRecipes(recipeRatings, elfIndices);
      moveElves(recipeRatings, elfIndices);
    }
  }
}
