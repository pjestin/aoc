import static java.lang.Character.toLowerCase;
import static java.lang.Character.isLowerCase;
import java.util.Set;
import java.util.HashSet;

public class Day05 {
  private static String transform(String polymer) {
    Set<Integer> tranformIndices = new HashSet<>();
    int i = 0;
    while (i < polymer.length() - 1) {
      if ((toLowerCase(polymer.charAt(i)) == toLowerCase(polymer.charAt(i + 1)))
          && (isLowerCase(polymer.charAt(i)) ^ isLowerCase(polymer.charAt(i + 1)))) {
        tranformIndices.add(i);
        tranformIndices.add(i + 1);
        i += 2;
      } else {
        i++;
      }
    }
    if (tranformIndices.isEmpty()) {
      return polymer;
    }
    StringBuilder sb = new StringBuilder();
    for (i = 0; i < polymer.length(); i++) {
      if (!tranformIndices.contains(i)) {
        sb.append(polymer.charAt(i));
      }
    }
    return sb.toString();
  }

  private static String stripPolymerFromUnitType(String polymer, char unitType) {
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < polymer.length(); i++) {
      if (toLowerCase(polymer.charAt(i)) != unitType) {
        sb.append(polymer.charAt(i));
      }
    }
    return sb.toString();
  }

  public static int getNbUnits(String polymer) {
    String transformedPolymer;
    while (true) {
      transformedPolymer = transform(polymer);
      if (transformedPolymer.length() >= polymer.length()) {
        break;
      }
      polymer = transformedPolymer;
    }
    return polymer.length();
  }

  public static int getOptimizedNbUnits(String polymer) {
    int minNbUnits = -1;
    for(char unitType = 'a'; unitType <='z'; unitType++) {
      String strippedPolymer = stripPolymerFromUnitType(polymer, unitType);
      int nbUnits = getNbUnits(strippedPolymer);
      if (minNbUnits == -1 || nbUnits < minNbUnits) {
        minNbUnits = nbUnits;
      }
    }
    return minNbUnits;
  }
}
