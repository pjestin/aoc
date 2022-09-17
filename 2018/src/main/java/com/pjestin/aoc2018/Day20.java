package com.pjestin.aoc2018;

import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.pjestin.lib.Vector;

public class Day20 {
  private static class Room {
    Map<Character, Room> neighbours = new HashMap<>();
    Vector position;

    public Room(Vector position) {
      this.position = position;
    }

    public String toString() {
      return neighbours.keySet().toString();
    }

    private Vector getNeighbourVector(char direction) {
      switch (direction) {
        case 'N':
          return new Vector(0, -1);
        case 'E':
          return new Vector(1, 0);
        case 'S':
          return new Vector(0, 1);
        case 'W':
          return new Vector(-1, 0);
        default:
          return null;
      }
    }

    private char getOppositeDirection(char direction) {
      switch (direction) {
        case 'N':
          return 'S';
        case 'E':
          return 'W';
        case 'S':
          return 'N';
        case 'W':
          return 'E';
        default:
          return '\0';
      }
    }

    public Vector addNeighbour(char direction, Map<Vector, Room> rooms) {
      Vector adjacentPosition = getNeighbourVector(direction).add(this.position);
      if (!rooms.containsKey(adjacentPosition)) {
        rooms.put(adjacentPosition, new Room(adjacentPosition));
      }
      Room adjacentRoom = rooms.get(adjacentPosition);
      adjacentRoom.neighbours.put(getOppositeDirection(direction), this);
      this.neighbours.put(direction, adjacentRoom);
      return adjacentPosition;
    }
  }

  private static Map<Vector, Room> createGraph(String routeRegex) {
    Map<Vector, Room> rooms = new HashMap<>();
    LinkedList<Vector> stack = new LinkedList<>();
    Vector position = new Vector(0, 0);
    rooms.put(position, new Room(position));
    for (char character : routeRegex.toCharArray()) {
      Room currentRoom = rooms.get(position);
      switch (character) {
        case 'N':
        case 'E':
        case 'S':
        case 'W':
          Vector adjacentPosition = currentRoom.addNeighbour(character, rooms);
          position = adjacentPosition;
          break;
        case '(':
          stack.push(position);
          break;
        case '|':
          position = stack.getFirst();
          break;
        case ')':
          position = stack.pop();
          break;
      }
    }
    return rooms;
  }

  private static class PositionQueueState {
    public Vector position;
    int steps;

    public PositionQueueState(Vector position, int steps) {
      this.position = position;
      this.steps = steps;
    }
  }

  private static int walkGraphForFarthestRoom(Map<Vector, Room> rooms) {
    LinkedList<PositionQueueState> queue = new LinkedList<>();
    queue.add(new PositionQueueState(new Vector(0, 0), 0));
    Set<Vector> visitedPositions = new HashSet<>();
    int maxSteps = 0;
    while (!queue.isEmpty()) {
      PositionQueueState queueState = queue.pop();
      Vector currentPosition = queueState.position;
      if (visitedPositions.contains(currentPosition)) {
        continue;
      }
      visitedPositions.add(currentPosition);
      if (queueState.steps > maxSteps) {
        maxSteps = queueState.steps;
      }
      Room currentRoom = rooms.get(currentPosition);
      for (Room neighbour : currentRoom.neighbours.values()) {
        queue.addLast(new PositionQueueState(neighbour.position, queueState.steps + 1));
      }
    }
    return maxSteps;
  }

  public static int findFarthestRoom(List<String> lines) {
    Map<Vector, Room> rooms = createGraph(lines.get(0));
    return walkGraphForFarthestRoom(rooms);
  }

  private static int walkGraphForRoomsFartherThan1000Doors(Map<Vector, Room> rooms) {
    LinkedList<PositionQueueState> queue = new LinkedList<>();
    queue.add(new PositionQueueState(new Vector(0, 0), 0));
    Set<Vector> visitedPositions = new HashSet<>();
    int countFarRooms = 0;
    while (!queue.isEmpty()) {
      PositionQueueState queueState = queue.pop();
      Vector currentPosition = queueState.position;
      if (visitedPositions.contains(currentPosition)) {
        continue;
      }
      visitedPositions.add(currentPosition);
      if (queueState.steps >= 1000) {
        countFarRooms++;
      }
      Room currentRoom = rooms.get(currentPosition);
      for (Room neighbour : currentRoom.neighbours.values()) {
        queue.addLast(new PositionQueueState(neighbour.position, queueState.steps + 1));
      }
    }
    return countFarRooms;
  }

  public static int findRoomsFartherThan1000Doors(List<String> lines) {
    Map<Vector, Room> rooms = createGraph(lines.get(0));
    return walkGraphForRoomsFartherThan1000Doors(rooms);
  }
}
