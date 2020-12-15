package day15

func GetMemoryGameNthNumber(startingNumbers []uint64, n uint64) uint64 {
	memory := make(map[uint64]uint64)
	turn := uint64(1)
	for _, startingNumber := range startingNumbers[:len(startingNumbers)-1] {
		memory[startingNumber] = turn
		turn++
	}
	currentNumber := startingNumbers[len(startingNumbers)-1]
	for turn < n {
		previousTurn, present := memory[currentNumber]
		var nextNumber uint64
		if present {
			nextNumber = turn - previousTurn
		} else {
			nextNumber = 0
		}
		memory[currentNumber] = turn
		currentNumber = nextNumber
		turn++
	}
	return currentNumber
}
