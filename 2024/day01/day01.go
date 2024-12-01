package day01

import (
	"regexp"
	"sort"
	"strconv"

	"github.com/pjestin/aoc2024/lib"
)

func parseLists(lines []string) ([]int, []int, error) {
	var list1 []int
	var list2 []int

	re, err := regexp.Compile("(\\d+)\\s+(\\d+)")
	if err != nil {
		return list1, list2, err
	}

	for _, line := range(lines) {
		parts := re.FindStringSubmatch(line)

		element1, err := strconv.Atoi(parts[1])
		if err != nil {
			return list1, list2, err
		}

		element2, err := strconv.Atoi(parts[2])
		if err != nil {
			return list1, list2, err
		}

		list1 = append(list1, element1)
		list2 = append(list2, element2)
	}

	return list1, list2, nil
}

// SumDistances sums the distance between each elements of the sorted lists
func SumDistances(lines []string) (int, error) {
	list1, list2, err := parseLists(lines)
	if err != nil {
		return 0, err
	}

	sort.Ints(list1)
	sort.Ints(list2)

	distanceSum := 0

	for i := 0; i < len(list1); i++ {
		distanceSum += lib.Abs(list1[i] - list2[i])
	}

	return distanceSum, nil
}

func countOccurrences(list []int) (map[int]int) {
	counts := make(map[int]int)

	for _, e := range(list) {
		if _, found := counts[e]; !found {
			counts[e] = 0
		}
		counts[e]++
	}

	return counts
}

// FindSimilarityScore finds the similarity score between the 2 lists in input
func FindSimilarityScore(lines []string) (int, error) {
	list1, list2, err := parseLists(lines)
	if err != nil {
		return 0, err
	}

	list2Occurrences := countOccurrences(list2)

	similarity := 0

	for _, e := range(list1) {
		if _, found := list2Occurrences[e]; found {
			similarity += e * list2Occurrences[e]
		}
	}

	return similarity, nil
}
