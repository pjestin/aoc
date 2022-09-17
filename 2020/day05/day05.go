package day05

import (
	"errors"
	"sort"
	"strconv"
	"strings"
)

func parseSeatIDs(lines []string) ([]uint64, error) {
	var seatIDs []uint64
	for _, line := range lines {
		binary := strings.Replace(line, "B", "1", -1)
		binary = strings.Replace(binary, "F", "0", -1)
		binary = strings.Replace(binary, "R", "1", -1)
		binary = strings.Replace(binary, "L", "0", -1)
		seatID, err := strconv.ParseUint(binary, 2, 64)
		if err != nil {
			return nil, err
		}
		seatIDs = append(seatIDs, seatID)
	}
	return seatIDs, nil
}

// CalculateMaxSeatID parses each line into a seat ID and returns the maximum number
func CalculateMaxSeatID(lines []string) (uint64, error) {
	seatIDs, err := parseSeatIDs(lines)
	if err != nil {
		return 0, err
	}
	var maxSeatID uint64
	for _, seatID := range seatIDs {
		if seatID > maxSeatID {
			maxSeatID = seatID
		}
	}
	return maxSeatID, nil
}

// CalculateMySeatID parses each line into a seat ID, then sorts the array, and looks for the missing number
func CalculateMySeatID(lines []string) (uint64, error) {
	seatIDs, err := parseSeatIDs(lines)
	if err != nil {
		return 0, err
	}
	sort.Slice(seatIDs, func(i, j int) bool { return seatIDs[i] < seatIDs[j] })
	for i := 1; i < len(seatIDs); i++ {
		if seatIDs[i]-seatIDs[i-1] > 1 {
			return seatIDs[i] - 1, nil
		}
	}
	return 0, errors.New("Not found")
}
