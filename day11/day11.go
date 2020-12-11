package day11

import "fmt"

type seat struct {
	x        int
	y        int
	occupied bool
}

func formatPosition(x int, y int) string {
	return fmt.Sprintf("%d;%d", x, y)
}

func parseSeats(lines []string) map[string]seat {
	seatMap := make(map[string]seat)
	for y, line := range lines {
		for x, ch := range line {
			if rune(ch) == 'L' {
				seatMap[formatPosition(x, y)] = seat{x: x, y: y, occupied: false}
			}
		}
	}
	return seatMap
}

func isSeatOccupied(x int, y int, seatMap map[string]seat) bool {
	s, present := seatMap[formatPosition(x, y)]
	return present && s.occupied
}

func countOccupiedAdjacentSeats(s seat, seatMap map[string]seat) int {
	adjacentOccupiedSeats := 0
	for dx := -1; dx <= 1; dx++ {
		if isSeatOccupied(s.x+dx, s.y-1, seatMap) {
			adjacentOccupiedSeats++
		}
		if isSeatOccupied(s.x+dx, s.y+1, seatMap) {
			adjacentOccupiedSeats++
		}
	}
	if isSeatOccupied(s.x+1, s.y, seatMap) {
		adjacentOccupiedSeats++
	}
	if isSeatOccupied(s.x-1, s.y, seatMap) {
		adjacentOccupiedSeats++
	}
	return adjacentOccupiedSeats
}

func isOccupiedSeatVisibleInDirection(s seat, seatMap map[string]seat, dx int, dy int) bool {
	for i := 1; i < 100; i++ {
		x := s.x + i*dx
		y := s.y + i*dy
		visibleSeat, present := seatMap[formatPosition(x, y)]
		if present {
			return visibleSeat.occupied
		}
	}
	return false
}

func countOccupiedVisibleSeats(s seat, seatMap map[string]seat) int {
	visibleOccupiedSeats := 0
	for dx := -1; dx <= 1; dx++ {
		if isOccupiedSeatVisibleInDirection(s, seatMap, dx, -1) {
			visibleOccupiedSeats++
		}
		if isOccupiedSeatVisibleInDirection(s, seatMap, dx, 1) {
			visibleOccupiedSeats++
		}
	}
	if isOccupiedSeatVisibleInDirection(s, seatMap, -1, 0) {
		visibleOccupiedSeats++
	}
	if isOccupiedSeatVisibleInDirection(s, seatMap, 1, 0) {
		visibleOccupiedSeats++
	}
	return visibleOccupiedSeats
}

func runSeatRound(seatMap map[string]seat) (map[string]seat, bool) {
	newSeatMap := make(map[string]seat)
	madeChange := false
	for seatPosition, s := range seatMap {
		occupied := s.occupied
		adjacentOccupiedSeats := countOccupiedAdjacentSeats(s, seatMap)
		if s.occupied && adjacentOccupiedSeats >= 4 {
			occupied = false
			madeChange = true
		} else if !s.occupied && adjacentOccupiedSeats == 0 {
			occupied = true
			madeChange = true
		}
		newSeatMap[seatPosition] = seat{x: s.x, y: s.y, occupied: occupied}
	}
	return newSeatMap, madeChange
}

func runSeatRoundExtendedRule(seatMap map[string]seat) (map[string]seat, bool) {
	newSeatMap := make(map[string]seat)
	madeChange := false
	for seatPosition, s := range seatMap {
		occupied := s.occupied
		visibleOccupiedSeats := countOccupiedVisibleSeats(s, seatMap)
		if s.occupied && visibleOccupiedSeats >= 5 {
			occupied = false
			madeChange = true
		} else if !s.occupied && visibleOccupiedSeats == 0 {
			occupied = true
			madeChange = true
		}
		newSeatMap[seatPosition] = seat{x: s.x, y: s.y, occupied: occupied}
	}
	return newSeatMap, madeChange
}

func countOccupiedSeats(seatMap map[string]seat) int {
	occupiedSeats := 0
	for _, s := range seatMap {
		if s.occupied {
			occupiedSeats++
		}
	}
	return occupiedSeats
}

// CountOccupiedSeats runs the seat rounds until no changes are made and returns the number of occupied seats
func CountOccupiedSeats(lines []string) int {
	seatMap := parseSeats(lines)
	madeChange := true
	for madeChange {
		seatMap, madeChange = runSeatRound(seatMap)
	}
	return countOccupiedSeats(seatMap)
}

// CountOccupiedSeatsExtendedRule runs the seat rounds with extended rules and returns the number of occupied seats
func CountOccupiedSeatsExtendedRule(lines []string) int {
	seatMap := parseSeats(lines)
	madeChange := true
	for madeChange {
		seatMap, madeChange = runSeatRoundExtendedRule(seatMap)
	}
	return countOccupiedSeats(seatMap)
}
