package lib

import (
	"fmt"
	"strconv"
	"strings"
)

// Vector represents both an actual vector, and a point in a 2D-space
type Vector struct {
	X int64
	Y int64
}

// Add modifies the vector to add the other vector to its coordinates
func (v *Vector) Add(other Vector) {
	v.X += other.X
	v.Y += other.Y
}

func abs(n int64) int64 {
	if n < 0 {
		return -n
	}
	return n
}

// ManhattanDistance returns the manhattan distance between the origin and the end of the vector
func (v *Vector) ManhattanDistance() int64 {
	return abs(v.X) + abs(v.Y)
}

// Format returns a string unique or the vector, which contains both X and Y
func (v *Vector) Format() string {
	return fmt.Sprintf("%d;%d", v.X, v.Y)
}

// ParseVector does the reverse of Format, it parses a vector from its formatted string
func ParseVector(positionString string) (Vector, error) {
	splitString := strings.Split(positionString, ";")
	x, err := strconv.ParseInt(splitString[0], 10, 64)
	if err != nil {
		return Vector{}, err
	}
	y, err := strconv.ParseInt(splitString[1], 10, 64)
	if err != nil {
		return Vector{}, err
	}
	return Vector{X: x, Y: y}, nil
}
