public class Vector implements Comparable<Vector> {
  public int x;
  public int y;

  public Vector(int x, int y) {
    this.x = x;
    this.y = y;
  }

  public Vector(Vector other) {
    this.x = other.x;
    this.y = other.y;
  }

  @Override
  public String toString() {
    return String.format("%d,%d", x, y);
  }

  @Override
  public int hashCode() {
    return 1412597 * y + 1237 * x;
  }

  @Override
  public boolean equals(Object obj) {
    return obj instanceof Vector && obj.hashCode() == hashCode();
  }

  @Override
  public int compareTo(Vector other) {
    return Integer.compare(hashCode(), other.hashCode());
  }

  public Vector add(Vector other) {
    x += other.x;
    y += other.y;
    return this;
  }
}
