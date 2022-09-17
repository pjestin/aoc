from __future__ import annotations

import re
import math
from typing import Optional

from lib.vector import Vector

PARTICLE_PATTERN: str = "p=<(-?\d+),(-?\d+),(-?\d+)>, v=<(-?\d+),(-?\d+),(-?\d+)>, a=<(-?\d+),(-?\d+),(-?\d+)>"


class Particle:
    def __init__(
        self, position: Vector, velocity: Vector, acceleration: Vector
    ) -> None:
        self.position = position
        self.velocity = velocity
        self.acceleration = acceleration
        self.destroyed = False
        self.discarded = False

    @classmethod
    def parse(cls, line: str) -> Particle:
        match: Optional[re.Match] = re.match(PARTICLE_PATTERN, line)

        if not match:
            raise Exception("Could not parse with regex")

        position = Vector(int(match.group(1)), int(match.group(2)), int(match.group(3)))
        velocity = Vector(int(match.group(4)), int(match.group(5)), int(match.group(6)))
        acceleration = Vector(
            int(match.group(7)), int(match.group(8)), int(match.group(9))
        )

        return cls(position, velocity, acceleration)

    def compare_long_term_distance_to_origin(self, o: Particle) -> int:
        if abs(self.acceleration) != abs(o.acceleration):
            return -1 if abs(self.acceleration) < abs(o.acceleration) else 1
        if abs(self.velocity) != abs(o.velocity):
            return -1 if abs(self.velocity) < abs(o.velocity) else 1
        if abs(self.position) != abs(o.position):
            return -1 if abs(self.position) < abs(o.position) else 1
        return 0

    def move(self):
        self.velocity += self.acceleration
        self.position += self.velocity

    def destroy(self):
        self.destroyed = True

    def discard(self):
        self.discarded = True


def find_closest_long_term_particle(lines: list[str]) -> int:
    particles: list[Particle] = list(map(Particle.parse, lines))
    min_long_term_distance_particle = particles[0]
    min_particle_index = 0
    for particle_index, particle in enumerate(particles):
        if (
            particle.compare_long_term_distance_to_origin(
                min_long_term_distance_particle
            )
            == -1
        ):
            min_long_term_distance_particle = particle
            min_particle_index = particle_index
    return min_particle_index


def __can_collide_dim(a: int, v: int, p: int) -> bool:
    if p == 0:
        return True
    return not (p > 0 and v >= 0 and a >= 0) and not (p < 0 and v <= 0 and a <= 0)


def __can_collide(p_i: Particle, p_j: Particle) -> bool:
    a_diff: Vector = p_i.acceleration - p_j.acceleration
    v_diff: Vector = p_i.velocity - p_j.velocity
    p_diff: Vector = p_i.position - p_j.position
    return (
        __can_collide_dim(a_diff.x, v_diff.x, p_diff.x)
        and __can_collide_dim(a_diff.y, v_diff.y, p_diff.y)
        and __can_collide_dim(a_diff.z, v_diff.z, p_diff.z)
    )


def count_non_colliding_particles(lines: list[str]) -> int:
    particles: list[Particle] = list(map(Particle.parse, lines))
    while True:
        for particle in particles:
            particle.move()
        colliding_particles_this_round: set[Particle] = set()
        considered_particle_pairs = 0
        for i in range(len(particles)):
            p_i: Particle = particles[i]
            if p_i.destroyed or p_i.discarded:
                continue

            considered_particle_neighbors = 0
            for j in range(i + 1, len(particles)):
                p_j: Particle = particles[j]
                if p_j.destroyed or p_j.discarded or not __can_collide(p_i, p_j):
                    continue
                considered_particle_pairs += 1
                considered_particle_neighbors += 1
                if p_i.position == p_j.position:
                    colliding_particles_this_round.add(p_i)
                    colliding_particles_this_round.add(p_j)

            if considered_particle_neighbors == 0:
                p_i.discard()

        for collided_particle in colliding_particles_this_round:
            collided_particle.destroy()

        if considered_particle_pairs == 0:
            break

    return sum(1 if not particle.destroyed else 0 for particle in particles)
