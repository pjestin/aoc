package day09

import (
	"errors"
	"strconv"
)

func parseNumbers(lines []string) ([]uint64, error) {
	var numbers []uint64
	for _, line := range lines {
		number, err := strconv.ParseUint(line, 10, 64)
		if err != nil {
			return nil, err
		}
		numbers = append(numbers, number)
	}
	return numbers, nil
}

func findFirstInvalidNumber(numbers []uint64, lookBack int) (uint64, error) {
	for index := lookBack; index < len(numbers); index++ {
		target := numbers[index]
		visitedNumbers := make(map[uint64]bool)
		foundMatch := false
		for lookBackIndex := index - lookBack; lookBackIndex < index; lookBackIndex++ {
			current := numbers[lookBackIndex]
			_, present := visitedNumbers[target-current]
			if present {
				foundMatch = true
				break
			}
			visitedNumbers[current] = true
		}
		if !foundMatch {
			return target, nil
		}
	}
	return 0, errors.New("Could not find invalid number")
}

// FindFirstInvalidNumber goes through the list numbers and finds the first number that cannot be expressed as the sum of 2 of the <lookBack> previous numbers
func FindFirstInvalidNumber(lines []string, lookBack int) (uint64, error) {
	numbers, err := parseNumbers(lines)
	if err != nil {
		return 0, err
	}
	return findFirstInvalidNumber(numbers, lookBack)
}

func findContiguousSet(numbers []uint64, target uint64) (int, int, error) {
	for begin := 0; begin < len(numbers); begin++ {
		end := begin
		var sum uint64
		for sum < target {
			sum += numbers[end]
			end++
		}
		if sum == target {
			return begin, end, nil
		}
	}
	return 0, 0, errors.New("Could not find matching set")
}

// FindTargetSumContiguousSet applies the previous function to find a target, then looks for a contiguous set with the target sum
func FindTargetSumContiguousSet(lines []string, lookBack int) (uint64, error) {
	numbers, err := parseNumbers(lines)
	if err != nil {
		return 0, err
	}
	target, err := findFirstInvalidNumber(numbers, lookBack)
	if err != nil {
		return 0, err
	}
	begin, end, err := findContiguousSet(numbers, target)
	if err != nil {
		return 0, err
	}
	setMin := numbers[begin]
	setMax := numbers[end-1]
	for index := begin; index < end; index++ {
		if numbers[index] < setMin {
			setMin = numbers[index]
		}
		if numbers[index] > setMax {
			setMax = numbers[index]
		}
	}
	return setMin + setMax, nil
}
