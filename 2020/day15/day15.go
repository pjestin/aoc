package day15

func GetMemoryGameNthNumber(startingNumbers []uint32, n uint32) uint32 {
	memory := make([]uint32, n+1)
	turn := uint32(1)
	for _, startingNumber := range startingNumbers[:len(startingNumbers)-1] {
		memory[startingNumber] = turn
		turn++
	}
	currentNumber := startingNumbers[len(startingNumbers)-1]
	for turn < n {
		previousTurn := memory[currentNumber]
		var nextNumber uint32
		if previousTurn == 0 {
			nextNumber = 0
		} else {
			nextNumber = turn - previousTurn
		}
		memory[currentNumber] = turn
		currentNumber = nextNumber
		turn++
	}
	return currentNumber
}
