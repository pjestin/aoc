import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Set;
import java.util.HashSet;
import java.util.TreeSet;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Day07 {
  private static class Worker {
    public char task = '0';
    public int remainingEffort = 0;

    public void assign(char task, int additionalEffort) {
      this.task = task;
      remainingEffort = (int)task - 64 + additionalEffort;
    }

    public void work() {
      remainingEffort = Math.max(0, remainingEffort - 1);
    }

    public boolean idle() {
      return remainingEffort == 0;
    }

    public boolean working() {
      return task != '0';
    }

    public boolean done() {
      return remainingEffort == 0 && task != '0';
    }
  }

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

  private static void markTaskAsDone(Worker w, TreeSet<Character> queue, Map<Character, Set<Character>> prerequisiteMap) {
    Set<Character> remainingTasks = new HashSet<>(prerequisiteMap.keySet());
    for (char task : remainingTasks) {
      prerequisiteMap.get(task).remove(w.task);
      if (prerequisiteMap.get(task).isEmpty()) {
        queue.add(task);
        prerequisiteMap.remove(task);
      }
    }
    w.task = '0';
  }

  public static String getTaskOrder(List<String> lines) {
    Map<Character, Set<Character>> prerequisiteMap = parsePrerequisiteMap(lines);
    Set<Character> leaves = findLeaves(prerequisiteMap);
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

  public static int getTotalTaskTimeWithWorkers(List<String> lines, int additionalEffort, int nbWorkers) {
    Map<Character, Set<Character>> prerequisiteMap = parsePrerequisiteMap(lines);
    Set<Character> leaves = findLeaves(prerequisiteMap);
    List<Worker> workers = Stream.generate(Worker::new).limit(nbWorkers).collect(Collectors.toList());
    TreeSet<Character> queue = new TreeSet<>();
    queue.addAll(leaves);
    int time = 0;
    while (!queue.isEmpty() || !prerequisiteMap.isEmpty() || workers.stream().filter(Worker::working).count() > 0) {
      for (Worker w : workers) {
        if (w.done()) {
          markTaskAsDone(w, queue, prerequisiteMap);
        }
      }
      for (Worker w : workers) {
        if (w.idle() && !queue.isEmpty()) {
          char task = queue.first();
          queue.remove(task);
          w.assign(task, additionalEffort);
        }
        w.work();
      }
      if (workers.stream().filter(Worker::working).count() > 0) {
        time++;
      }
    }
    return time;
  }
}
