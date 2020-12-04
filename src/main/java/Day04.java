import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Collections;
import static java.lang.Integer.parseInt;

public class Day04 {
  private static class GuardIdMinutePair {
    public int guardId;
    public int minute;

    public GuardIdMinutePair(int guardId, int minute) {
      this.guardId = guardId;
      this.minute = minute;
    }
  }

  private static Map<Integer, Map<Integer, Integer>> getGuardSleepMinutes(List<String> lines) {
    int guardId = -1;
    Pattern shiftBeginPattern = Pattern.compile(".*Guard #(\\d+) begins shift");
    Pattern fallAsleepPattern = Pattern.compile("\\[\\d{4}-\\d{2}-\\d{2} \\d{2}:(\\d{2})\\] falls asleep");
    Pattern wakeUpPattern = Pattern.compile("\\[\\d{4}-\\d{2}-\\d{2} \\d{2}:(\\d{2})\\] wakes up");
    Map<Integer, Map<Integer, Integer>> guardSleepMinutes = new HashMap<>();
    int fellAsleepAt = 0;
    for (String line : lines) {
      Matcher shiftBeginMatcher = shiftBeginPattern.matcher(line);
      Matcher fallAlseepMatcher = fallAsleepPattern.matcher(line);
      Matcher wakeUpMatcher = wakeUpPattern.matcher(line);
      if (shiftBeginMatcher.find()) {
        // New guard
        guardId = parseInt(shiftBeginMatcher.group(1));
      } else if (fallAlseepMatcher.find()) {
        // Fall alseep at minute parseInt(fallAlseepMatcher.group(1))
        fellAsleepAt = parseInt(fallAlseepMatcher.group(1));
      } else if (wakeUpMatcher.find()) {
        // Wake up at minute parseInt(wakeUpMatcher.group(1))
        if (!guardSleepMinutes.containsKey(guardId)) {
          guardSleepMinutes.put(guardId, new HashMap<>());
        }
        Map<Integer, Integer> sleepMinutes = guardSleepMinutes.get(guardId);
        for (int minute = fellAsleepAt; minute < parseInt(wakeUpMatcher.group(1)); minute++) {
          sleepMinutes.put(minute, sleepMinutes.getOrDefault(minute, 0) + 1);
        }
        guardSleepMinutes.put(guardId, sleepMinutes);
      }
    }
    return guardSleepMinutes;
  }

  private static int getMaxSleepGuardId(Map<Integer, Map<Integer, Integer>> guardSleepMinutes) {
    int maxSleepMinutes = 0;
    int maxSleepGuardId = 0;
    for (Map.Entry<Integer, Map<Integer, Integer>> entry : guardSleepMinutes.entrySet()) {
      int sleepMinutes = 0;
      for (int minutes : entry.getValue().values()) {
        sleepMinutes += minutes;
      }
      if (sleepMinutes > maxSleepMinutes) {
        maxSleepMinutes = sleepMinutes;
        maxSleepGuardId = entry.getKey();
      }
    }
    return maxSleepGuardId;
  }

  private static int getMaxSleepMinute(Map<Integer, Integer> maxSleepGuardSleepMinutes) {
    int maxSleepMinute = 0;
    int maxSleepTime = 0;
    for (Map.Entry<Integer, Integer> entry : maxSleepGuardSleepMinutes.entrySet()) {
      if (entry.getValue() > maxSleepTime) {
        maxSleepTime = entry.getValue();
        maxSleepMinute = entry.getKey();
      }
    }
    return maxSleepMinute;
  }

  private static GuardIdMinutePair getMaxSleepGuardIdMinute(Map<Integer, Map<Integer, Integer>> guardSleepMinutes) {
    int maxSleepGuardId = 0;
    int maxSleepMinute = 0;
    int maxSleepTime = 0;
    for (Map.Entry<Integer, Map<Integer, Integer>> guardEntry : guardSleepMinutes.entrySet()) {
      for (Map.Entry<Integer, Integer> minuteEntry : guardEntry.getValue().entrySet()) {
        if (minuteEntry.getValue() > maxSleepTime) {
          maxSleepGuardId = guardEntry.getKey();
          maxSleepMinute = minuteEntry.getKey();
          maxSleepTime = minuteEntry.getValue();
        }
      }
    }
    return new GuardIdMinutePair(maxSleepGuardId, maxSleepMinute);
  }

  public static int getGuardIdMinuteProductStrategy1(List<String> lines) {
    // Sort logs by chronological order
    Collections.sort(lines);
    // Map each minute that a guard sleeps, for each guard
    Map<Integer, Map<Integer, Integer>> guardSleepMinutes = getGuardSleepMinutes(lines);
    // Get the guard who slept the most
    int maxSleepGuardId = getMaxSleepGuardId(guardSleepMinutes);
    // Get his sleep map
    Map<Integer, Integer> maxSleepGuardSleepMinutes = guardSleepMinutes.get(maxSleepGuardId);
    // Get the minute at which the guard was sleeping the most
    int maxSleepMinute = getMaxSleepMinute(maxSleepGuardSleepMinutes);
    // Return product
    return maxSleepGuardId * maxSleepMinute;
  }

  public static int getGuardIdMinuteProductStrategy2(List<String> lines) {
    // Sort logs by chronological order
    Collections.sort(lines);
    // Map each minute that a guard sleeps, for each guard
    Map<Integer, Map<Integer, Integer>> guardSleepMinutes = getGuardSleepMinutes(lines);
    // Get the guard ID - minute pair with the most sleep
    GuardIdMinutePair maxSleepGuardIdMinute = getMaxSleepGuardIdMinute(guardSleepMinutes);
    // Return product
    return maxSleepGuardIdMinute.guardId * maxSleepGuardIdMinute.minute;
  }
}
