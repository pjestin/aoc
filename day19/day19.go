package day19

import (
	"errors"
	"strconv"
	"strings"
)

type rule struct {
	litteral           rune
	ruleIndicesOptions [][]int
}

func parseRulesAndMessages(lines []string) (map[int]rule, []string, error) {
	rules := make(map[int]rule)
	var messages []string
	foundEmptyLine := false
	for _, line := range lines {
		if len(line) == 0 {
			foundEmptyLine = true
		} else if foundEmptyLine {
			messages = append(messages, line)
		} else {
			splitLine := strings.Split(line, ": ")
			index, err := strconv.Atoi(splitLine[0])
			if err != nil {
				return nil, nil, err
			}
			if strings.HasPrefix(splitLine[1], "\"") {
				rules[index] = rule{litteral: rune(splitLine[1][1])}
			} else {
				options := strings.Split(splitLine[1], " | ")
				ruleIndicesOptions := make([][]int, len(options))
				for i, option := range options {
					splitOption := strings.Split(option, " ")
					ruleIndicesOption := make([]int, len(splitOption))
					for j, ruleIndex := range splitOption {
						ruleIndicesOption[j], err = strconv.Atoi(ruleIndex)
						if err != nil {
							return nil, nil, err
						}
					}
					ruleIndicesOptions[i] = ruleIndicesOption
				}
				rules[index] = rule{ruleIndicesOptions: ruleIndicesOptions}
			}
		}
	}
	return rules, messages, nil
}

func checkMessageRule(message string, rules map[int]rule, ruleIndex int, messageIndex int) (bool, int, error) {
	// fmt.Println("Checking", message, "at", messageIndex, "; ruleIndex:", ruleIndex)
	if messageIndex >= len(message) {
		return false, 0, nil
	}
	r, present := rules[ruleIndex]
	if !present {
		return false, 0, errors.New("Rule index does not exist")
	}
	if r.ruleIndicesOptions == nil {
		// fmt.Println("Litteral matches:", rune(message[messageIndex]) == r.litteral)
		return rune(message[messageIndex]) == r.litteral, messageIndex + 1, nil
	}
	for _, option := range r.ruleIndicesOptions {
		// fmt.Println("Matching with", option, "rule", ruleIndex)
		optionMatch := true
		thisOptionMessageIndex := messageIndex
		for _, ruleIndex := range option {
			// fmt.Println("Checking rule", ruleIndex)
			check, newMessageIndex, err := checkMessageRule(message, rules, ruleIndex, thisOptionMessageIndex)
			if err != nil {
				return false, 0, err
			}
			if !check {
				// fmt.Println("This option doesn't match")
				optionMatch = false
				break
			}
			thisOptionMessageIndex = newMessageIndex
		}
		if optionMatch {
			// fmt.Println("An option matches for rule", ruleIndex, ":", option, "at", messageIndex, "; returning message index", thisOptionMessageIndex, "; substring:", message[messageIndex:thisOptionMessageIndex])
			return true, thisOptionMessageIndex, nil
		}
	}
	return false, 0, nil
}

func checkMessage(message string, rules map[int]rule) (bool, error) {
	check, lastMessageIndex, err := checkMessageRule(message, rules, 0, 0)
	if err != nil {
		return false, err
	}
	// fmt.Println("Result for", message, ":", check, ";", lastMessageIndex)
	return check && lastMessageIndex == len(message), nil
}

// CountMatchingMessages goes through each input message and matches it with the given set of rules
func CountMatchingMessages(lines []string) (int, error) {
	rules, messages, err := parseRulesAndMessages(lines)
	if err != nil {
		return 0, err
	}
	count := 0
	for _, message := range messages {
		check, err := checkMessage(message, rules)
		if err != nil {
			return 0, err
		}
		if check {
			count++
		}
	}
	return count, nil
}

func CountMatchingMessagesWithRuleFix(lines []string) (int, error) {
	rules, messages, err := parseRulesAndMessages(lines)
	if err != nil {
		return 0, err
	}
	rules[8] = rule{ruleIndicesOptions: [][]int{{42}, {42, 8}}}
	rules[11] = rule{ruleIndicesOptions: [][]int{{42, 31}, {42, 11, 31}}}
	count := 0
	for _, message := range messages {
		check, err := checkMessage(message, rules)
		if err != nil {
			return 0, err
		}
		if check {
			count++
		}
	}
	return count, nil
}
