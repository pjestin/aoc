import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Day07 {
  private static final String PATTERN = "^Step (\\w) must be finished before step (\\w) can begin.$";

  private static Map<Character, Set<Character>> parsePrerequisiteMap(List<String> lines) {
    HashMap<Character, Set<Character>> prerequisiteMap = new HashMap<>();
    Pattern pattern = Pattern.compile(PATTERN);
    for (String line : lines) {
      Matcher matcher = pattern.matcher(line);
      if (matcher.find()) {
        char begin = matcher.group(1).charAt(0);
        char end = matcher.group(2).charAt(0);
        if (!prerequisiteMap.containsKey(end)) {
          prerequisiteMap.put(end, new HashSet<>());
        }
        prerequisiteMap.get(end).add(begin);
      }
    }
    return prerequisiteMap;
  }

  private static Set<Character> findLeaves(Map<Character, Set<Character>> prerequisiteMap) {
    Set<Character> leaves = new HashSet<>();
    prerequisiteMap.values().stream().forEach(leaves::addAll);
    leaves.removeAll(prerequisiteMap.keySet());
    return leaves;
  }

  private static String executeInOrder(Map<Character, Set<Character>> prerequisiteMap, Set<Character> leaves) {
    StringBuilder sb = new StringBuilder();
    TreeSet<Character> queue = new TreeSet<>();
    queue.addAll(leaves);
    while (!queue.isEmpty()) {
      char current = queue.first();
      queue.remove(current);
      sb.append(current);
      Set<Character> remainingTasks = new HashSet<>(prerequisiteMap.keySet());
      for (char task : remainingTasks) {
        prerequisiteMap.get(task).remove(current);
        if (prerequisiteMap.get(task).isEmpty()) {
          queue.add(task);
          prerequisiteMap.remove(task);
        }
      }
    }
    return sb.toString();
  }

  public static String getTaskOrder(List<String> lines) {
    Map<Character, Set<Character>> prerequisiteMap = parsePrerequisiteMap(lines);
    Set<Character> leaves = findLeaves(prerequisiteMap);
    return executeInOrder(prerequisiteMap, leaves);
  }
}
