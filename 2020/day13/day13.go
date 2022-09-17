package day13

import (
	"strconv"
	"strings"
)

func parseBaseTimestampAndBusIDs(lines []string) (uint64, []uint64, error) {
	baseTimestamp, err := strconv.ParseUint(lines[0], 10, 64)
	if err != nil {
		return 0, nil, err
	}
	var busIDs []uint64
	for _, busIDString := range strings.Split(lines[1], ",") {
		if busIDString == "x" {
			busIDs = append(busIDs, uint64(0))
			continue
		}
		busID, err := strconv.ParseUint(busIDString, 10, 64)
		if err != nil {
			return 0, nil, err
		}
		busIDs = append(busIDs, busID)
	}
	return baseTimestamp, busIDs, nil
}

func FindEarliestDeparture(lines []string) (uint64, error) {
	baseTimestamp, busIDs, err := parseBaseTimestampAndBusIDs(lines)
	if err != nil {
		return 0, err
	}
	earliestTimestamp := uint64(0)
	earliestLeavingBusID := uint64(0)
	for _, busID := range busIDs {
		if busID == 0 {
			continue
		}
		quotient := baseTimestamp/busID + 1
		leavingTimestamp := busID*quotient - baseTimestamp
		if earliestTimestamp == 0 || leavingTimestamp < earliestTimestamp {
			earliestTimestamp = leavingTimestamp
			earliestLeavingBusID = busID
		}
	}
	return earliestTimestamp * earliestLeavingBusID, nil
}

func FindSubsequentDepartureTimestamp(lines []string) (uint64, error) {
	_, busIDs, err := parseBaseTimestampAndBusIDs(lines)
	if err != nil {
		return 0, err
	}
	factor := uint64(1)
	timestamp := uint64(0)
	for index, busID := range busIDs {
		if busID == 0 {
			continue
		}
		for (timestamp+uint64(index))%busID != 0 {
			timestamp += factor
		}
		factor *= busID
	}
	return timestamp, nil
}
