package day02

import (
	"strconv"
	"strings"

	"github.com/pjestin/aoc2024/lib"
)

func parseReports(lines []string) ([][]int, error) {
	var reports [][]int

	for _, line := range lines {
		levels := strings.Split(line, " ")
		var report []int

		for _, level := range levels {
			intLevel, err := strconv.Atoi(level)
			if err != nil {
				return nil, err
			}

			report = append(report, intLevel)
		}

		reports = append(reports, report)
	}

	return reports, nil
}

func isReportSafe(report []int, toIgnore int) bool {
	previousLevel := -1
	direction := 0

	for index, level := range report {
		if index == toIgnore {
			continue
		}

		difference := lib.Abs(level - previousLevel)
		if previousLevel != -1 && (difference < 1 || difference > 3) {
			return false
		}

		if (direction == 1 && level <= previousLevel) || (direction == -1 && level >= previousLevel) {
			return false
		}

		if direction == 0 && previousLevel != -1 {
			if level < previousLevel {
				direction = -1
			} else {
				direction = 1
			}
		}

		previousLevel = level
	}

	return true
}

// CountSafeReports parse each report and counts the ones that are safe, i.e. monotonic
func CountSafeReports(lines []string) (int, error) {
	reports, err := parseReports(lines)
	if err != nil {
		return 0, err
	}

	count := 0
	for _, report := range reports {
		if isReportSafe(report, -1) {
			count++
		}
	}

	return count, nil
}

func isReportSafeWithPD(report []int) bool {
	if isReportSafe(report, -1) {
		return true
	}

	for i := 0; i < len(report); i++ {
		if isReportSafe(report, i) {
			return true
		}
	}

	return false
}

// CountSafeReportsWithPD does the same but allow one bad level
func CountSafeReportsWithPD(lines []string) (int, error) {
	reports, err := parseReports(lines)
	if err != nil {
		return 0, err
	}

	count := 0
	for _, report := range reports {
		if isReportSafeWithPD(report) {
			count++
		}
	}

	return count, nil
}
