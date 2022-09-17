package day17

import (
	"fmt"
	"strings"
)

func formatPosition(position []int) string {
	dimensionStrings := make([]string, len(position))
	for i := 0; i < len(position); i++ {
		dimensionStrings[i] = fmt.Sprint(position[i])
	}
	return strings.Join(dimensionStrings, ";")
}

func parseCubes(lines []string, dim int) map[string][]int {
	cubes := make(map[string][]int)
	for y := 0; y < len(lines); y++ {
		line := lines[y]
		for x := 0; x < len(line); x++ {
			if rune(line[x]) == '#' {
				dimensions := make([]int, dim)
				dimensions[0] = x
				dimensions[1] = y
				cubes[formatPosition(dimensions)] = dimensions
			}
		}
	}
	return cubes
}

func getBoundaries(cubes map[string][]int, dim int) ([]int, []int) {
	minBoundaries := make([]int, dim)
	maxBoundaries := make([]int, dim)
	first := true
	for _, c := range cubes {
		for dimIndex := 0; dimIndex < dim; dimIndex++ {
			if first || c[dimIndex] < minBoundaries[dimIndex] {
				minBoundaries[dimIndex] = c[dimIndex]
			}
			if first || c[dimIndex] > maxBoundaries[dimIndex] {
				maxBoundaries[dimIndex] = c[dimIndex]
			}
		}
		first = false
	}
	return minBoundaries, maxBoundaries
}

func countNeighbouringCubes(position []int, neighboorPosition []int, cubes map[string][]int, dimIndex int) int {
	if dimIndex == len(position) {
		samePosition := true
		for i := 0; i < len(position); i++ {
			if position[i] != neighboorPosition[i] {
				samePosition = false
				break
			}
		}
		if samePosition {
			return 0
		}
		neighboorPositionString := formatPosition(neighboorPosition)
		_, active := cubes[neighboorPositionString]
		if active {
			return 1
		}
		return 0
	}
	count := 0
	for dxi := -1; dxi <= 1; dxi++ {
		neighboorPosition[dimIndex] = position[dimIndex] + dxi
		count += countNeighbouringCubes(position, neighboorPosition, cubes, dimIndex+1)
	}
	return count
}

func updateAtPosition(position []int, minBoundaries []int, maxBoundaries []int, cubes map[string][]int, nextCubes map[string][]int, dimIndex int) {
	if dimIndex == len(position) {
		neighboorPosition := make([]int, len(position))
		neighbouringCubes := countNeighbouringCubes(position, neighboorPosition, cubes, 0)
		positionString := formatPosition(position)
		_, active := cubes[positionString]
		if neighbouringCubes == 3 || (active && neighbouringCubes == 2) {
			thisPosition := make([]int, len(position))
			copy(thisPosition, position)
			nextCubes[positionString] = thisPosition
		}
		return
	}
	for xi := minBoundaries[dimIndex] - 1; xi <= maxBoundaries[dimIndex]+1; xi++ {
		position[dimIndex] = xi
		updateAtPosition(position, minBoundaries, maxBoundaries, cubes, nextCubes, dimIndex+1)
	}
}

func runCycle(cubes map[string][]int, dim int) map[string][]int {
	nextCubes := make(map[string][]int)
	minBoundaries, maxBoundaries := getBoundaries(cubes, dim)
	position := make([]int, dim)
	updateAtPosition(position, minBoundaries, maxBoundaries, cubes, nextCubes, 0)
	return nextCubes
}

// GetCubesAfterCycles parses the input cubes and runs 6 cycles on a number of dimensions, after which it returns the number of cubes
func GetCubesAfterCycles(lines []string, dim int) int {
	cubes := parseCubes(lines, dim)
	for i := 0; i < 6; i++ {
		cubes = runCycle(cubes, dim)
	}
	return len(cubes)
}
