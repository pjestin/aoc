package environment

func Checksum(lines []string) int {
	var countOfTwos, countOfThrees int
	for _, line := range lines {
		counts := make(map[rune]int)
		for _, character := range line {
			_, exists := counts[character]
			if !exists {
				counts[character] = 0
			}
			counts[character]++
		}
		for _, count := range counts {
			if count == 2 {
				countOfTwos++
				break
			}
		}
		for _, count := range counts {
			if count == 3 {
				countOfThrees++
				break
			}
		}
	}
	return countOfTwos * countOfThrees
}
