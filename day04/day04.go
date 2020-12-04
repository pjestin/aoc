package day04

import (
	"strconv"
	"strings"

	"github.com/pjestin/aoc2020/lib"
)

func parsePassports(lines []string) []map[string]string {
	currentPassport := make(map[string]string)
	var passports []map[string]string
	for _, line := range lines {
		if len(line) == 0 {
			if len(currentPassport) != 0 {
				passports = append(passports, currentPassport)
				currentPassport = make(map[string]string)
			}
		} else {
			keyValues := strings.Split(line, " ")
			for _, keyValueString := range keyValues {
				keyValue := strings.Split(keyValueString, ":")
				currentPassport[keyValue[0]] = keyValue[1]
			}
		}
	}
	if len(currentPassport) != 0 {
		passports = append(passports, currentPassport)
	}
	return passports
}

func isPassportValid(p map[string]string) bool {
	_, hasCid := p["cid"]
	return len(p) == 8 || (len(p) == 7 && !hasCid)
}

func isPassportDataValid(p map[string]string) bool {
	for key, value := range p {
		switch key {
		case "byr":
			intValue, err := strconv.Atoi(value)
			if err != nil || intValue < 1920 || intValue > 2002 {
				return false
			}
		case "iyr":
			intValue, err := strconv.Atoi(value)
			if err != nil || intValue < 2010 || intValue > 2020 {
				return false
			}
		case "eyr":
			intValue, err := strconv.Atoi(value)
			if err != nil || intValue < 2020 || intValue > 2030 {
				return false
			}
		case "hgt":
			if len(value) == 5 {
				intValue, err := strconv.Atoi(value[0:3])
				if err != nil || value[3:5] != "cm" || intValue < 150 || intValue > 193 {
					return false
				}
			} else if len(value) == 4 {
				intValue, err := strconv.Atoi(value[0:2])
				if err != nil || value[2:4] != "in" || intValue < 59 || intValue > 76 {
					return false
				}
			} else {
				return false
			}
		case "hcl":
			if rune(value[0]) != '#' || len(value) != 7 {
				return false
			}
			_, err := strconv.ParseUint(value[1:], 16, 64)
			if err != nil {
				return false
			}
		case "ecl":
			validEyeColors := []string{"amb", "blu", "brn", "gry", "grn", "hzl", "oth"}
			if !lib.Contains(validEyeColors, value) {
				return false
			}
		case "pid":
			_, err := strconv.ParseUint(value, 10, 64)
			if err != nil || len(value) != 9 {
				return false
			}
		}
	}
	return true
}

// CountValidPassports parses the passports from input lines and returns the number of valid ones
func CountValidPassports(lines []string) int {
	passports := parsePassports(lines)
	var validPassportCount int
	for _, p := range passports {
		if isPassportValid(p) {
			validPassportCount++
		}
	}
	return validPassportCount
}

// CountValidPassportsAddedValidation parses the passports from input lines and returns the number of valid ones, with an extra layer of security
func CountValidPassportsData(lines []string) int {
	passports := parsePassports(lines)
	var validPassportCount int
	for _, p := range passports {
		if isPassportValid(p) && isPassportDataValid(p) {
			validPassportCount++
		}
	}
	return validPassportCount
}
