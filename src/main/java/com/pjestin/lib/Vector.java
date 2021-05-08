package com.pjestin.lib;

public class Vector implements Comparable<Vector> {
  public int dimension;
  public int x = 0;
  public int y = 0;
  public int z = 0;
  public int w = 0;

  public Vector(int x, int y) {
    this.x = x;
    this.y = y;
    this.dimension = 2;
  }

  public Vector(int x, int y, int z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dimension = 3;
  }

  public Vector(int x, int y, int z, int w) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.dimension = 4;
  }

  public Vector(Vector other) {
    this.x = other.x;
    this.y = other.y;
    this.z = other.z;
    this.w = other.w;
    this.dimension = other.dimension;
  }

  @Override
  public String toString() {
    switch (this.dimension) {
      case 2:
        return String.format("%d,%d", this.x, this.y);
      case 3:
        return String.format("%d,%d,%d", this.x, this.y, this.z);
      case 4:
        return String.format("%d,%d,%d,%d", this.x, this.y, this.z, this.w);
      default:
        return "Unknown dimension";
    }

  }

  @Override
  public int hashCode() {
    return this.toString().hashCode();
  }

  @Override
  public boolean equals(Object obj) {
    return obj instanceof Vector && obj.hashCode() == hashCode();
  }

  @Override
  public int compareTo(Vector other) {
    if (this.w != other.w) {
      return this.w - other.w;
    }
    if (this.z != other.z) {
      return this.z - other.z;
    }
    if (this.y != other.y) {
      return this.y - other.y;
    }
    return this.x - other.x;
  }

  public Vector add(Vector other) {
    x += other.x;
    y += other.y;
    z += other.z;
    w += other.w;
    return this;
  }

  public int distance(Vector other) {
    return Math.abs(other.x - this.x) + Math.abs(other.y - this.y) + Math.abs(other.z - this.z)
        + Math.abs(other.w - this.w);
  }
}
