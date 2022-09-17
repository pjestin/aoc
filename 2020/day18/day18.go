package day18

import (
	"strconv"
)

func changeAcc(acc int64, operation rune, value int64) int64 {
	if operation == '*' {
		return acc * value
	}
	return acc + value
}

func findSubExpressionEnd(line string, begin int, end int) int {
	parenCount := 1
	for i := begin + 1; i < end; i++ {
		if rune(line[i]) == '(' {
			parenCount++
		} else if rune(line[i]) == ')' {
			parenCount--
		}
		if parenCount == 0 {
			return i
		}
	}
	return end
}

func evaluateExpressionEqualPrecedence(line string, begin int, end int) (int64, error) {
	operation := '+'
	var acc int64
	i := begin
	for i < end {
		switch rune(line[i]) {
		case ' ':
			i++
			continue
		case '+':
			operation = '+'
			i++
		case '*':
			operation = '*'
			i++
		case '(':
			subExpressionEnd := findSubExpressionEnd(line, i, end)
			subExpressionValue, err := evaluateExpressionEqualPrecedence(line, i+1, subExpressionEnd)
			if err != nil {
				return 0, err
			}
			acc = changeAcc(acc, operation, subExpressionValue)
			i = subExpressionEnd + 1
		default:
			value, err := strconv.ParseInt(line[i:i+1], 10, 64)
			if err != nil {
				return 0, err
			}
			acc = changeAcc(acc, operation, value)
			i++
		}
	}
	return acc, nil
}

// SumOperationResultsEqualPrecedence evaluates each line using equal precedence and sums their result
func SumOperationResultsEqualPrecedence(lines []string) (int64, error) {
	var sum int64
	for _, line := range lines {
		value, err := evaluateExpressionEqualPrecedence(line, 0, len(line))
		if err != nil {
			return 0, err
		}
		sum += value
	}
	return sum, nil
}

func evaluateExpressionDifferentPrecedence(line string, begin int, end int) (int64, error) {
	var intermediateResult int64
	acc := int64(1)
	i := begin
	for i < end {
		switch rune(line[i]) {
		case ' ':
			i++
			continue
		case '+':
			i++
			continue
		case '*':
			acc *= intermediateResult
			intermediateResult = 0
			i++
		case '(':
			subExpressionEnd := findSubExpressionEnd(line, i, end)
			subExpressionValue, err := evaluateExpressionDifferentPrecedence(line, i+1, subExpressionEnd)
			if err != nil {
				return 0, err
			}
			intermediateResult += subExpressionValue
			i = subExpressionEnd + 1
		default:
			value, err := strconv.ParseInt(line[i:i+1], 10, 64)
			if err != nil {
				return 0, err
			}
			intermediateResult += value
			i++
		}
	}
	acc *= intermediateResult
	return acc, nil
}

// SumOperationResultsDifferentPrecedence evaluates each line using different precedence and sums their result
func SumOperationResultsDifferentPrecedence(lines []string) (int64, error) {
	var sum int64
	for _, line := range lines {
		value, err := evaluateExpressionDifferentPrecedence(line, 0, len(line))
		if err != nil {
			return 0, err
		}
		sum += value
	}
	return sum, nil
}
