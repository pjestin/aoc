package day03

type slope struct {
	dx int
	dy int
}

var slopes = []slope{
	{dx: 1, dy: 1},
	{dx: 3, dy: 1},
	{dx: 5, dy: 1},
	{dx: 7, dy: 1},
	{dx: 1, dy: 2},
}

var defaultSlope = slopes[1]

func countTreesInSlope(lines []string, sl slope) int {
	var treeCount, x int
	for y := 0; y < len(lines); y += sl.dy {
		if string(lines[y][x]) == "#" {
			treeCount++
		}
		x = (x + sl.dx) % len(lines[y])
	}
	return treeCount
}

// CountTreesInDefaultSlope counts the number of trees on the default slope
func CountTreesInDefaultSlope(lines []string) int {
	return countTreesInSlope(lines, defaultSlope)
}

// FindProductOfTreeCountsInSlopes loops over the slopes to count their trees and returns the product of counts
func FindProductOfTreeCountsInSlopes(lines []string) uint64 {
	var product uint64 = 1
	for _, sl := range slopes {
		product *= uint64(countTreesInSlope(lines, sl))
	}
	return product
}
