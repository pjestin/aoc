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
	if messageIndex >= len(message) {
		return false, 0, nil
	}
	r, present := rules[ruleIndex]
	if !present {
		return false, 0, errors.New("Rule index does not exist")
	}
	if r.ruleIndicesOptions == nil {
		return rune(message[messageIndex]) == r.litteral, messageIndex + 1, nil
	}
	for _, option := range r.ruleIndicesOptions {
		optionMatch := true
		thisOptionMessageIndex := messageIndex
		for _, ruleIndex := range option {
			check, newMessageIndex, err := checkMessageRule(message, rules, ruleIndex, thisOptionMessageIndex)
			if err != nil {
				return false, 0, err
			}
			if !check {
				optionMatch = false
				break
			}
			thisOptionMessageIndex = newMessageIndex
		}
		if optionMatch {
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

func checkMessageRuleWithLoops(message string, rules map[int]rule) (bool, error) {
	for splitIndex := 1; splitIndex < len(message)-1; splitIndex++ {
		check8, lastMessageIndex8, err := checkMessageRule(message[:splitIndex], rules, 8, 0)
		if err != nil {
			return false, err
		}
		check11, lastMessageIndex11, err := checkMessageRule(message[splitIndex:], rules, 11, 0)
		if err != nil {
			return false, err
		}
		if check8 && lastMessageIndex8 == splitIndex && check11 && lastMessageIndex11 == len(message)-splitIndex {
			return true, nil
		}
	}
	return false, nil
}

// CountMatchingMessagesWithRuleFix fixes the rules 8 and 11 and checks each message with loop behavior
func CountMatchingMessagesWithRuleFix(lines []string) (int, error) {
	rules, messages, err := parseRulesAndMessages(lines)
	if err != nil {
		return 0, err
	}
	rules[8] = rule{ruleIndicesOptions: [][]int{{42, 8}, {42}}}
	rules[11] = rule{ruleIndicesOptions: [][]int{{42, 11, 31}, {42, 31}}}
	count := 0
	for _, message := range messages {
		check, err := checkMessageRuleWithLoops(message, rules)
		if err != nil {
			return 0, err
		}
		if check {
			count++
		}
	}
	return count, nil
}
