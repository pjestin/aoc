import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.stream.IntStream;

public class Day12 {
  private static String parsePotString(List<String> lines) {
    return lines.get(0).split(": ")[1];
  }

  private static Set<String> parseRuleSet(List<String> lines) {
    Set<String> ruleSet = new HashSet<>();
    for (int i = 2; i < lines.size(); i++) {
      String[] rule = lines.get(i).split(" => ");
      if (rule[1].charAt(0) == '#') {
        ruleSet.add(rule[0]);
      }
    }
    return ruleSet;
  }

  private static String runGeneration(String potString, Set<String> ruleSet) {
    StringBuilder nextPotStringBuilder = new StringBuilder(String.format(".%s.", potString));
    potString = String.format("...%s...", potString);
    for (int i = 0; i < potString.length() - 4; i++) {
      boolean willHavePlant = ruleSet.contains(potString.substring(i, i + 5));
      nextPotStringBuilder.replace(i, i + 1, willHavePlant ? "#" : ".");
    }
    return nextPotStringBuilder.toString();
  }

  private static final int GENERATION_NUMBER = 20;

  public static int getPlantChecksumAfterTwentyGenerations(List<String> lines) {
    String potString = parsePotString(lines);
    Set<String> ruleSet = parseRuleSet(lines);
    for (int i = 0; i < GENERATION_NUMBER; i++) {
      potString = runGeneration(potString, ruleSet);
    }
    final String finalPotString = potString;
    return IntStream.range(0, potString.length())
      .filter(potNumber -> finalPotString.charAt(potNumber) == '#')
      .map(potNumber -> potNumber - GENERATION_NUMBER)
      .reduce(0, Integer::sum);
  }
}
