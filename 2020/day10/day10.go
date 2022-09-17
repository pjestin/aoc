package day10

import (
	"sort"
	"strconv"
)

func parseAdapterJoltRatings(lines []string) ([]uint64, error) {
	var joltRatings []uint64
	joltRatings = append(joltRatings, 0)
	for _, line := range lines {
		rating, err := strconv.ParseUint(line, 10, 64)
		if err != nil {
			return nil, err
		}
		joltRatings = append(joltRatings, rating)
	}
	sort.Slice(joltRatings, func(i, j int) bool { return joltRatings[i] < joltRatings[j] })
	joltRatings = append(joltRatings, joltRatings[len(joltRatings)-1]+3)
	return joltRatings, nil
}

// FindJoltDistribution counts the differences between elements of the sorted jolt rating list
func FindJoltDistribution(lines []string) (uint64, error) {
	joltRatings, err := parseAdapterJoltRatings(lines)
	if err != nil {
		return 0, err
	}
	joltDifferences := make([]uint64, 3)
	previousJoltRating := uint64(0)
	for _, joltRating := range joltRatings[1:] {
		joltDifferences[joltRating-previousJoltRating-1]++
		previousJoltRating = joltRating
	}
	return joltDifferences[0] * joltDifferences[2], nil
}

func numberOfArrangementsAtIndex(joltRatings []uint64, index int, cache map[int]uint64) uint64 {
	if index == len(joltRatings)-1 {
		return 1
	}
	value, present := cache[index]
	if present {
		return value
	}
	var sum uint64
	for nextJoltIndex := index + 1; nextJoltIndex <= index+3; nextJoltIndex++ {
		if nextJoltIndex >= len(joltRatings) {
			break
		} else if joltRatings[nextJoltIndex]-joltRatings[index] > 3 {
			break
		}
		res := numberOfArrangementsAtIndex(joltRatings, nextJoltIndex, cache)
		sum += res
	}
	cache[index] = sum
	return sum
}

// FindNumberOfArrangements goes through the sorted list of jolt ratings and counts every arrangement with it
func FindNumberOfArrangements(lines []string) (uint64, error) {
	joltRatings, err := parseAdapterJoltRatings(lines)
	if err != nil {
		return 0, err
	}
	cache := make(map[int]uint64)
	return numberOfArrangementsAtIndex(joltRatings, 0, cache), nil
}
