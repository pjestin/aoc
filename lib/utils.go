package lib

// Contains returns true if the key can be found in the array
func Contains(array []string, key string) bool {
	for _, element := range array {
		if element == key {
			return true
		}
	}
	return false
}
