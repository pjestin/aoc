import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.stream.Collectors;

public class Day13 {
  private static class Cart {
    public Vector position;
    public Vector direction;
    public int nextIntersectionBehavior = 0; // 0: left, 1: straight, 2: right
  }

  private static Map<Vector, Character> parseTracks(List<String> lines) {
    Map<Vector, Character> tracks = new HashMap<>();
    for (int y = 0; y < lines.size(); y++) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); x++) {
        char ch = line.charAt(x);
        if (ch != ' ') {
          Vector position = new Vector(x, y);
          if (ch == 'v' || ch == '^') {
            tracks.put(position, '|');
          } else if (ch == '>' || ch == '<') {
            tracks.put(position, '-');
          } else {
            tracks.put(position, ch);
          }
        }
      }
    }
    return tracks;
  }

  private static TreeMap<Vector, Cart> parseCarts(List<String> lines) {
    TreeMap<Vector, Cart> carts = new TreeMap<>();
    for (int y = 0; y < lines.size(); y++) {
      String line = lines.get(y);
      for (int x = 0; x < line.length(); x++) {
        char ch = line.charAt(x);
        if (ch == 'v' || ch == '^' || ch == '<' || ch == '>') {
          Cart cart = new Cart();
          cart.position = new Vector(x, y);
          switch (ch) {
            case '^':
              cart.direction = new Vector(0, -1);
              break;
            case 'v':
              cart.direction = new Vector(0, 1);
              break;
            case '<':
              cart.direction = new Vector(-1, 0);
              break;
            case '>':
              cart.direction = new Vector(1, 0);
              break;
          }
          carts.put(cart.position, cart);
        }
      }
    }
    return carts;
  }

  private static void changeCartDirection(Cart cart, Map<Vector, Character> tracks) {
    char trackPiece = tracks.get(cart.position);
    switch (trackPiece) {
      case '/':
        if (cart.direction.x == 0) {
          cart.direction = new Vector(-cart.direction.y, 0);
        } else {
          cart.direction = new Vector(0, -cart.direction.x);
        }
        break;
      case '\\':
        if (cart.direction.x == 0) {
          cart.direction = new Vector(cart.direction.y, 0);
        } else {
          cart.direction = new Vector(0, cart.direction.x);
        }
        break;
      case '+':
        switch (cart.nextIntersectionBehavior) {
          case 0:
            cart.direction = new Vector(cart.direction.y, -cart.direction.x);
            break;
          case 2:
            cart.direction = new Vector(-cart.direction.y, cart.direction.x);
            break;
        }
        cart.nextIntersectionBehavior = (cart.nextIntersectionBehavior + 1) % 3;
        break;
    }
  }

  public static String getCrashCoordinates(List<String> lines) {
    Map<Vector, Character> tracks = parseTracks(lines);
    TreeMap<Vector, Cart> carts = parseCarts(lines);
    while (true) {
      for (Cart cart : carts.values().stream().collect(Collectors.toList())) {
        carts.remove(cart.position);
        cart.position.add(cart.direction);
        if (carts.containsKey(cart.position)) {
          return cart.position.toString();
        }
        carts.put(cart.position, cart);
        changeCartDirection(cart, tracks);
      }
    }
  }

  public static String getLastRemainingCartCoordinates(List<String> lines) {
    Map<Vector, Character> tracks = parseTracks(lines);
    TreeMap<Vector, Cart> carts = parseCarts(lines);
    while (true) {
      for (Cart cart : carts.values().stream().collect(Collectors.toList())) {
        if (!carts.containsKey(cart.position)) {
          continue;
        }
        carts.remove(cart.position);
        cart.position.add(cart.direction);
        if (carts.containsKey(cart.position)) {
          carts.remove(cart.position);
          continue;
        }
        carts.put(cart.position, cart);
        changeCartDirection(cart, tracks);
      }
      if (carts.size() <= 1) {
        return carts.keySet().iterator().next().toString();
      }
    }

  }
}
