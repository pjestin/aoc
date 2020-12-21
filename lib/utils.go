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

// ContainsInt returns true if the key can be found in the array
func ContainsInt(array []int, key int) bool {
	for _, element := range array {
		if element == key {
			return true
		}
	}
	return false
}

// ContainsString returns true if the key can be found in the array
func ContainsString(array []string, key string) bool {
	for _, element := range array {
		if element == key {
			return true
		}
	}
	return false
}

// IntersectionInt returns a 3rd array with elements from both arrays
func IntersectionInt(a1 []int, a2 []int) []int {
	var a3 []int
	for _, a1Element := range a1 {
		if ContainsInt(a2, a1Element) {
			a3 = append(a3, a1Element)
		}
	}
	return a3
}

// IntersectionString returns a 3rd array with elements from both arrays
func IntersectionString(a1 []string, a2 []string) []string {
	var a3 []string
	for _, a1Element := range a1 {
		if ContainsString(a2, a1Element) {
			a3 = append(a3, a1Element)
		}
	}
	return a3
}

// RemoveInt searches the key in the array and returns a new array without it (order may change)
func RemoveInt(a []int, key int) []int {
	for index, element := range a {
		if element == key {
			a[len(a)-1], a[index] = a[index], a[len(a)-1]
			return a[:len(a)-1]
		}
	}
	return a
}

// RemoveString searches the key in the array and returns a new array without it (order may change)
func RemoveString(a []string, key string) []string {
	for index, element := range a {
		if element == key {
			a[len(a)-1], a[index] = a[index], a[len(a)-1]
			return a[:len(a)-1]
		}
	}
	return a
}
