package day23

import (
	"fmt"
	"strconv"
	"strings"
)

func parseCups(input string) ([]int, error) {
	splitLine := strings.Split(input, "")
	cups := make([]int, len(input))
	for i, numberString := range splitLine {
		cup, err := strconv.Atoi(numberString)
		if err != nil {
			return nil, err
		}
		cups[i] = cup
	}
	return cups, nil
}

func mod(a int, b int) int {
	return ((a % b) + b) % b
}

func chooseDestinationCupIndex(cups []int, currentCupIndex int) int {
	destinationCupLabel := cups[currentCupIndex] - 1
	for true {
		// fmt.Println("Trying with", destinationCupLabel)
		destinationCupIndex := 0
		for i := 0; i < len(cups); i++ {
			if cups[i] == destinationCupLabel {
				destinationCupIndex = i
				break
			}
		}
		isValid := true
		for i := 0; i < 3; i++ {
			if destinationCupIndex == mod(currentCupIndex+i+1, len(cups)) {
				isValid = false
				break
			}
		}
		if isValid {
			return destinationCupIndex
		}
		destinationCupLabel = mod(destinationCupLabel-2, len(cups)) + 1
	}
	return 0
}

func swapRanges(cups []int, start int, mid int, end int) {
	n := len(cups)
	displacement := mod(end-mid, n)
	loopSize := mod(end-start, n)
	swappedCups := make([]int, len(cups))
	cupIndex := start
	for i := 0; i < loopSize; i++ {
		loopIndex := mod(cupIndex-start, n)
		newLoopIndex := mod(loopIndex+displacement, loopSize)
		newCupIndex := mod(newLoopIndex+start, n)
		// fmt.Println("New index:", newCupIndex, "; old index:", cupIndex, "start:", start, "mid:", mid, "end:", end)
		swappedCups[newCupIndex] = cups[cupIndex]
		cupIndex = mod(cupIndex+1, n)
	}
	// fmt.Println("Swapped cups:", swappedCups)
	cupIndex = start
	for i := 0; i < loopSize; i++ {
		cups[cupIndex] = swappedCups[cupIndex]
		cupIndex = mod(cupIndex+1, n)
	}
}

func makeMove(cups []int, currentCupIndex int) int {
	destinationCupIndex := chooseDestinationCupIndex(cups, currentCupIndex)
	// fmt.Println("Current cup index:", currentCupIndex, ";destination cup index:", destinationCupIndex)
	start := mod(currentCupIndex+1, len(cups))
	mid := mod(currentCupIndex+4, len(cups))
	end := destinationCupIndex + 1
	swapRanges(cups, start, mid, end)
	return start
}

func getOrderAfterOne(cups []int) string {
	n := len(cups)
	cupIndex := 0
	for cups[cupIndex] != 1 {
		cupIndex++
	}
	stringNumbers := make([]string, len(cups))
	for i := 0; i < n-1; i++ {
		stringNumbers[i] = fmt.Sprint(cups[mod(cupIndex+i+1, n)])
	}
	return strings.Join(stringNumbers, "")
}

// GetCupOrderAfterMoves moves the cups a number of times and returns their final order
func GetCupOrderAfterMoves(input string, moves int) (string, error) {
	cups, err := parseCups(input)
	if err != nil {
		return "", err
	}
	fmt.Println("Cups:", cups)
	currentCupIndex := 0
	for round := 0; round < moves; round++ {
		currentCupIndex = makeMove(cups, currentCupIndex)
		fmt.Println("Cups:", cups)
	}
	return getOrderAfterOne(cups), nil
}
