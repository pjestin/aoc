import java.util.List;
import java.util.Map;
import java.util.HashMap;

public class Day02 {
  public static int getChecksum(List<String> lines) {
    int countOfTwos = 0;
    int countOfThrees = 0;
    for (String line : lines) {
      Map<Character, Integer> counts = new HashMap<>();
      char[] chars = line.toCharArray();
      for (char ch : chars) {
        counts.put(ch, counts.getOrDefault(ch, 0) + 1);
      }
      for (int count : counts.values()) {
        if (count == 2) {
          countOfTwos++;
          break;
        }
      }
      for (int count : counts.values()) {
        if (count == 3) {
          countOfThrees++;
          break;
        }
      }
    }
    return countOfTwos * countOfThrees;
  }

  public static String getBoxIdCommonLetters(List<String> lines) {
    for (int i = 0; i < lines.size(); i++) {
      for (int j = i + 1; j < lines.size(); j++) {
        int nbDifferences = 0;
        int differenceIndex = -1;
        String line1 = lines.get(i);
        String line2 = lines.get(j);
        for (int k = 0; k < line1.length(); k++) {
          if (line1.charAt(k) != line2.charAt(k)) {
            differenceIndex = k;
            nbDifferences++;
            if (nbDifferences > 1) {
              break;
            }
          }
        }
        if (nbDifferences == 1) {
          return new StringBuilder(line1).deleteCharAt(differenceIndex).toString();
        } else if (nbDifferences == 0) {
          return line1;
        }
      }
    }
    return null;
  }
}
