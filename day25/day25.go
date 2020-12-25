package day25

const (
	DIVIDER = 20201227
	INITIAL_SUBJECT_NUMBER = 7
)

func transform(value int, subjectNumber int) int {
	return (value * subjectNumber) % DIVIDER
}

func findLoopSize(publicKey int) int {
	value := 1
	loopIndex := 0
	for value != publicKey {
		value = transform(value, INITIAL_SUBJECT_NUMBER)
		loopIndex++
	}
	return loopIndex
}

func GetEncryptionKey(cardPublicKey int, doorPublicKey int) int {
	cardLoopSize := findLoopSize(cardPublicKey)
	value := 1
	for i := 0; i < cardLoopSize; i++ {
		value = transform(value, doorPublicKey)
	}
	return value
}
