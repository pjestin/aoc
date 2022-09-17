package day12

import (
	"strconv"

	"github.com/pjestin/aoc2020/lib"
)

type instruction struct {
	operation rune
	value     int64
}

func parseNavigationInstructions(lines []string) ([]instruction, error) {
	var instructions []instruction
	for _, line := range lines {
		value, err := strconv.ParseInt(line[1:], 10, 64)
		if err != nil {
			return nil, err
		}
		instructions = append(instructions, instruction{operation: rune(line[0]), value: value})
	}
	return instructions, nil
}

type ship struct {
	position        lib.Vector
	facingDirection lib.Vector
}

func (s *ship) move(ins instruction) {
	switch ins.operation {
	case 'F':
		forwardVector := lib.Vector{X: ins.value * s.facingDirection.X, Y: ins.value * s.facingDirection.Y}
		s.position.Add(forwardVector)
	case 'L':
		nbTurns := ins.value / 90
		for i := int64(0); i < nbTurns; i++ {
			s.facingDirection = lib.Vector{X: s.facingDirection.Y, Y: -s.facingDirection.X}
		}
	case 'R':
		nbTurns := ins.value / 90
		for i := int64(0); i < nbTurns; i++ {
			s.facingDirection = lib.Vector{X: -s.facingDirection.Y, Y: s.facingDirection.X}
		}
	}
}

func moveVector(v *lib.Vector, ins instruction) {
	switch ins.operation {
	case 'N':
		v.Y -= ins.value
	case 'S':
		v.Y += ins.value
	case 'E':
		v.X += ins.value
	case 'W':
		v.X -= ins.value
	}
}

// GetShipDistance moves the ship following the navigation instructions and returns its Manhattan distance to the starting point
func GetShipDistance(lines []string) (int64, error) {
	instructions, err := parseNavigationInstructions(lines)
	if err != nil {
		return 0, err
	}
	s := ship{facingDirection: lib.Vector{X: 1, Y: 0}}
	for _, ins := range instructions {
		if ins.operation == 'N' || ins.operation == 'S' || ins.operation == 'E' || ins.operation == 'W' {
			moveVector(&s.position, ins)
		} else {
			s.move(ins)
		}
	}
	return s.position.ManhattanDistance(), nil
}

// GetShipDistanceUsingWaypoint moves the ship using the waypoint method and returns its Manhattan distance from the starting point
func GetShipDistanceUsingWaypoint(lines []string) (int64, error) {
	instructions, err := parseNavigationInstructions(lines)
	if err != nil {
		return 0, err
	}
	s := ship{facingDirection: lib.Vector{X: 10, Y: -1}}
	for _, ins := range instructions {
		if ins.operation == 'N' || ins.operation == 'S' || ins.operation == 'E' || ins.operation == 'W' {
			moveVector(&s.facingDirection, ins)
		} else {
			s.move(ins)
		}
	}
	return s.position.ManhattanDistance(), nil
}
