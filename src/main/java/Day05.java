import static java.lang.Character.toLowerCase;
import static java.lang.Character.isLowerCase;

public class Day05 {
  private static String transform(String polymer) {
    StringBuilder sb = new StringBuilder();
    int i = 0;
    while (i < polymer.length()) {
      if (i < polymer.length() - 1
          && (toLowerCase(polymer.charAt(i)) == toLowerCase(polymer.charAt(i + 1)))
          && (isLowerCase(polymer.charAt(i)) ^ isLowerCase(polymer.charAt(i + 1)))) {
        i += 2;
      } else {
        sb.append(polymer.charAt(i));
        i++;
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

  private static String fullyTransform(String polymer) {
    String transformedPolymer;
    while (true) {
      transformedPolymer = transform(polymer);
      if (transformedPolymer.length() >= polymer.length()) {
        break;
      }
      polymer = transformedPolymer;
    }
    return polymer;
  }

  public static int getNbUnits(String polymer) {
    return fullyTransform(polymer).length();
  }

  public static int getOptimizedNbUnits(String polymer) {
    String transformedPolymer = fullyTransform(polymer);
    int minNbUnits = -1;
    for(char unitType = 'a'; unitType <= 'z'; unitType++) {
      String strippedPolymer = stripPolymerFromUnitType(transformedPolymer, unitType);
      int nbUnits = getNbUnits(strippedPolymer);
      if (minNbUnits == -1 || nbUnits < minNbUnits) {
        minNbUnits = nbUnits;
      }
    }
    return minNbUnits;
  }
}
