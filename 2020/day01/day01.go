package day01

import (
	"errors"
	"strconv"
)

const sumTarget = 2020

func convertToInts(lines []string) (elements []int, err error) {
	for _, line := range lines {
		element, err := strconv.Atoi(line)
		if err != nil {
			return elements, err
		}
		elements = append(elements, element)
	}
	return
}

// FindExpenseReportSum finds the pair of elements in the input slice whose sum is equal to the target sum and returns their product
func FindExpenseReportSum(lines []string) (int, error) {
	elements, err := convertToInts(lines)
	if err != nil {
		return 0, err
	}
	previousElements := make(map[int]bool)
	for _, element := range elements {
		_, present := previousElements[sumTarget-element]
		if present {
			return (sumTarget - element) * element, nil
		}
		previousElements[element] = true
	}
	return 0, errors.New("Not found")
}

// FindExpenseReportTripleSum finds the trio of elements in the input slice whose sum is equal to the target sum and returns their product
func FindExpenseReportTripleSum(lines []string) (int, error) {
	elements, err := convertToInts(lines)
	if err != nil {
		return 0, err
	}
	for i, a := range elements {
		previousElements := make(map[int]bool)
		for _, b := range elements[i+1:] {
			_, present := previousElements[sumTarget-a-b]
			if present {
				return (sumTarget - a - b) * a * b, nil
			}
			previousElements[b] = true
		}
	}
	return 0, errors.New("Not found")
}
