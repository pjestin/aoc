package day01

import (
	"errors"
	"strconv"
)

const SumTarget = 2020

func ConvertToInts(lines []string) (elements []int, err error) {
	for _, line := range lines {
		element, err := strconv.Atoi(line)
		if err != nil {
			return elements, err
		}
		elements = append(elements, element)
	}
	return
}

func FindExpenseReportSum(lines []string) (int, error) {
	elements, err := ConvertToInts(lines)
	if err != nil {
		return 0, err
	}
	previousElements := make(map[int]bool)
	for _, element := range elements {
		_, present := previousElements[SumTarget-element]
		if present {
			return (SumTarget - element) * element, nil
		}
		previousElements[element] = true
	}
	return 0, errors.New("Not found")
}

func FindExpenseReportTripleSum(lines []string) (int, error) {
	elements, err := ConvertToInts(lines)
	if err != nil {
		return 0, err
	}
	for i, a := range elements {
		previousElements := make(map[int]bool)
		for _, b := range elements[i+1:] {
			_, present := previousElements[SumTarget-a-b]
			if present {
				return (SumTarget - a - b) * a * b, nil
			}
			previousElements[b] = true
		}
	}
	return 0, errors.New("Not found")
}
