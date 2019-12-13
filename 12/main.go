package main

import (
	"fmt"
)

var (
	INITIAL_POSITIONS = [][]int{
		{12, 0, -15},
		{-8, -5, -10},
		{7, -17, 1},
		{2, -11, -6},
	}
	INITIAL_VELOCITIES = [][]int{
		{0, 0, 0},
		{0, 0, 0},
		{0, 0, 0},
		{0, 0, 0},
	}
)

func runStep(positions *[][]int, velocities *[][]int) {
	for moonIndex, position := range *positions {
		for _, otherPosition := range *positions {
			for i := 0; i < 3; i++ {
				if position[i] < otherPosition[i] {
					(*velocities)[moonIndex][i] += 1
				} else if position[i] > otherPosition[i] {
					(*velocities)[moonIndex][i] -= 1
				}
			}
		}
	}
	for moonIndex, velocity := range *velocities {
		for i := 0; i < 3; i++ {
			(*positions)[moonIndex][i] += velocity[i]
		}
	}
}

func arrayEq(A *[]int, B *[]int) bool {
	for i := 0; i < 3; i++ {
		if (*A)[i] != (*B)[i] {
			return false
		}
	}
	return true
}

func deepCopy(A [][]int) [][]int {
	cpy := make([][]int, len(A))
	for index := 0; index < len(A); index++ {
		cpy[index] = make([]int, len(A[index]))
		copy(cpy[index], A[index])
	}
	return cpy
}

func runOnDimension(dim int) int {
	positions := deepCopy(INITIAL_POSITIONS)
	velocities := deepCopy(INITIAL_VELOCITIES)
	steps := 1
	runStep(&positions, &velocities)
	for true {
		stop := true
		for index := 0; index < 4; index++ {
			if positions[index][dim] != INITIAL_POSITIONS[index][dim] || velocities[index][dim] != INITIAL_VELOCITIES[index][dim] {
				stop = false
			}
		}
		if stop {
			break
		}
		runStep(&positions, &velocities)
		steps += 1
		if steps%10000000 == 0 {
			fmt.Println(steps)
		}
	}
	return steps
}

func gcd(a int, b int) int {
	big := a
	small := b
	if big < small {
		big = b
		small = a
	}
	for small != 0 {
		temp := big % small
		big = small
		small = temp
	}
	return big
}

func lcm(a int, b int) int {
	return a * b / (gcd(a, b))
}

func main() {
	stepsX := runOnDimension(0)
	stepsY := runOnDimension(1)
	stepsZ := runOnDimension(2)
	fmt.Println(lcm(stepsX, lcm(stepsY, stepsZ)))
}
