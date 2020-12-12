package lib

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
