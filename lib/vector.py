from __future__ import annotations


class Vector:
    def __init__(self, x: int, y: int, z: int = 0) -> None:
        self.x = x
        self.y = y
        self.z = z

    def __str__(self) -> str:
        return "({};{};{})".format(self.x, self.y, self.z)

    def __repr__(self) -> str:
        return str(self)

    def __add__(self, o: Vector):
        return Vector(self.x + o.x, self.y + o.y, self.z + o.z)

    def __sub__(self, o: Vector):
        return Vector(self.x - o.x, self.y - o.y, self.z - o.z)

    def __abs__(self) -> int:
        return self.distance(Vector(0, 0, 0))

    def __eq__(self, o: object) -> bool:
        return (
            isinstance(o, Vector) and self.x == o.x and self.y == o.y and self.z == o.z
        )

    def __hash__(self) -> int:
        return hash(str(self))

    def distance(self, o: Vector) -> int:
        return abs(o.x - self.x) + abs(o.y - self.y) + abs(o.z - self.z)
