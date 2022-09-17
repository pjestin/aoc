package day02

import (
	"regexp"
	"strconv"
	"strings"
)

type passwordWithPolicy struct {
	policyArg1      int
	policyArg2      int
	policyCharacter byte
	password        string
}

func parsePasswordsWithPolicies(lines []string) ([]passwordWithPolicy, error) {
	var res []passwordWithPolicy
	re, err := regexp.Compile("(\\d+)-(\\d+) (\\w): (\\w+)")
	if err != nil {
		return res, err
	}
	for _, line := range lines {
		parts := re.FindStringSubmatch(line)
		policyArg1, err := strconv.Atoi(parts[1])
		if err != nil {
			return res, err
		}
		policyArg2, err := strconv.Atoi(parts[2])
		if err != nil {
			return res, err
		}
		res = append(res, passwordWithPolicy{
			policyArg1:      policyArg1,
			policyArg2:      policyArg2,
			policyCharacter: parts[3][0],
			password:        parts[4],
		})
	}
	return res, nil
}

func xor(a bool, b bool) bool {
	return (a || b) && !(a && b)
}

// ValidatePasswordsPart1 goes through each of the input passwords and returns a count of valid ones according to the first policy rule set
func ValidatePasswordsPart1(lines []string) (int, error) {
	passwords, err := parsePasswordsWithPolicies(lines)
	if err != nil {
		return 0, err
	}
	validPasswordCount := 0
	for _, password := range passwords {
		count := strings.Count(password.password, string(password.policyCharacter))
		if count >= password.policyArg1 && count <= password.policyArg2 {
			validPasswordCount++
		}
	}
	return validPasswordCount, nil
}

// ValidatePasswordsPart2 goes through each of the input passwords and returns a count of valid ones according to the second policy rule set
func ValidatePasswordsPart2(lines []string) (int, error) {
	passwords, err := parsePasswordsWithPolicies(lines)
	if err != nil {
		return 0, err
	}
	validPasswordCount := 0
	for _, password := range passwords {
		if xor(password.password[password.policyArg1-1] == password.policyCharacter,
			password.password[password.policyArg2-1] == password.policyCharacter) {
			validPasswordCount++
		}
	}
	return validPasswordCount, nil
}
