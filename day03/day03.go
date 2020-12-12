package day03

import "github.com/pjestin/aoc2020/lib"

var slopes = []lib.Vector{
	{X: 1, Y: 1},
	{X: 3, Y: 1},
	{X: 5, Y: 1},
	{X: 7, Y: 1},
	{X: 1, Y: 2},
}

var defaultSlope = slopes[1]

func countTreesInSlope(lines []string, sl lib.Vector) int64 {
	var treeCount, x int64
	for y := int64(0); y < int64(len(lines)); y += sl.Y {
		if string(lines[y][x]) == "#" {
			treeCount++
		}
		x = (x + sl.X) % int64(len(lines[y]))
	}
	return treeCount
}

// CountTreesInDefaultSlope counts the number of trees on the default slope
func CountTreesInDefaultSlope(lines []string) int64 {
	return countTreesInSlope(lines, defaultSlope)
}

// FindProductOfTreeCountsInSlopes loops over the slopes to count their trees and returns the product of counts
func FindProductOfTreeCountsInSlopes(lines []string) int64 {
	var product int64 = 1
	for _, sl := range slopes {
		product *= countTreesInSlope(lines, sl)
	}
	return product
}
