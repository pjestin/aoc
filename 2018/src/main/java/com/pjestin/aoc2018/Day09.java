package com.pjestin.aoc2018;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.Collections;
import java.util.ArrayList;
import java.util.List;
import static java.lang.Integer.parseInt;

public class Day09 {
  private static class MarbleConfig {
    public int nbPlayers;
    public int lastMarblePoints;

    public MarbleConfig(int nbPlayers, int lastMarblePoints) {
      this.nbPlayers = nbPlayers;
      this.lastMarblePoints = lastMarblePoints;
    }

    private static final String PATTERN = "^(\\d+) players; last marble is worth (\\d+) points$";

    public static MarbleConfig parse(String line) {
      Pattern pattern = Pattern.compile(PATTERN);
      Matcher matcher = pattern.matcher(line);
      matcher.find();
      return new MarbleConfig(parseInt(matcher.group(1)), parseInt(matcher.group(2)));
    }
  }

  private static class LinkedListNode {
    public LinkedListNode previous;
    public LinkedListNode next;
    public int value;

    public LinkedListNode(int value) {
      this.value = value;
    }
  }

  private static long getWinningScore(MarbleConfig config) {
    List<Long> playerScores = new ArrayList<>(Collections.nCopies(config.nbPlayers, (long)0));
    int player = 1;
    LinkedListNode currentMarble = new LinkedListNode(0);
    currentMarble.previous = currentMarble;
    currentMarble.next = currentMarble;
    for (int marble = 1; marble <= config.lastMarblePoints; marble++) {
      if (marble % 23 == 0) {
        LinkedListNode marbleToBeRemoved = currentMarble.previous.previous.previous.previous.previous.previous.previous;
        marbleToBeRemoved.previous.next = marbleToBeRemoved.next;
        marbleToBeRemoved.next.previous = marbleToBeRemoved.previous;
        currentMarble = marbleToBeRemoved.next;
        playerScores.set(player - 1, playerScores.get(player - 1) + marble + marbleToBeRemoved.value);
      } else {
        LinkedListNode newMarble = new LinkedListNode(marble);
        newMarble.next = currentMarble.next.next;
        newMarble.previous = currentMarble.next;
        newMarble.next.previous = newMarble;
        newMarble.previous.next = newMarble;
        currentMarble = newMarble;
      }
      player = (player % config.nbPlayers) + 1;
    }
    return Collections.max(playerScores);
  }

  public static long getWinningScore(String line) {
    MarbleConfig config = MarbleConfig.parse(line);
    return getWinningScore(config);
  }

  public static long getWinningScoreHundredFold(String line) {
    MarbleConfig config = MarbleConfig.parse(line);
    config.lastMarblePoints *= 100;
    return getWinningScore(config);
  }
}
