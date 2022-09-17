package day06

func parseGroups(lines []string) [][]string {
	var groups [][]string
	var group []string
	for _, line := range lines {
		if len(line) == 0 {
			groups = append(groups, group)
			group = make([]string, 0)
		} else {
			group = append(group, line)
		}
	}
	groups = append(groups, group)
	return groups
}

// SumGroupYesQuestionsUnion parse questionnaire answers for each group and sums the combined group Yes answers
func SumGroupYesQuestionsUnion(lines []string) int {
	groups := parseGroups(lines)
	var sum int
	for _, group := range groups {
		questions := make(map[rune]bool)
		for _, person := range group {
			for _, char := range person {
				questions[char] = true
			}
		}
		sum += len(questions)
	}
	return sum
}

// SumGroupYesQuestionsIntersection parse questionnaire answers for each group and sums the intersected group Yes answers
func SumGroupYesQuestionsIntersection(lines []string) int {
	groups := parseGroups(lines)
	sum := 0
	for _, group := range groups {
		groupQuestions := make(map[rune]bool)
		for _, char := range group[0] {
			groupQuestions[char] = true
		}
		for _, person := range group[1:] {
			personQuestions := make(map[rune]bool)
			for _, char := range person {
				personQuestions[char] = true
			}
			for char := range groupQuestions {
				_, present := personQuestions[char]
				if !present {
					delete(groupQuestions, char)
				}
			}
		}
		sum += len(groupQuestions)
	}
	return sum
}
