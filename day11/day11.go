package day11

type seat struct {
	present  bool
	occupied bool
}

func parseSeats(lines []string) [][]seat {
	seatGrid := make([][]seat, len(lines))
	for y, line := range lines {
		seatGrid[y] = make([]seat, len(line))
		for x, ch := range line {
			seatGrid[y][x] = seat{present: rune(ch) == 'L', occupied: false}
		}
	}
	return seatGrid
}

func isAdjacentSeatOccupied(x int, y int, dx int, dy int, seatGrid [][]seat, checkFirstVisibleSeat bool) int {
	if checkFirstVisibleSeat {
		visibleSeatX := x + dx
		visibleSeatY := y + dy
		for visibleSeatX >= 0 && visibleSeatX < len(seatGrid[0]) && visibleSeatY >= 0 && visibleSeatY < len(seatGrid) {
			if seatGrid[visibleSeatY][visibleSeatX].occupied {
				return 1
			} else if seatGrid[visibleSeatY][visibleSeatX].present {
				return 0
			}
			visibleSeatX += dx
			visibleSeatY += dy
		}
		return 0
	}
	if x+dx >= 0 && x+dx < len(seatGrid[0]) && y+dy >= 0 && y+dy < len(seatGrid) && seatGrid[y+dy][x+dx].occupied {
		return 1
	}
	return 0
}

func countOccupiedAdjacentSeats(x int, y int, seatGrid [][]seat, extendedRule bool) int {
	adjacentOccupiedSeats := 0
	for dx := -1; dx <= 1; dx++ {
		adjacentOccupiedSeats += isAdjacentSeatOccupied(x, y, dx, 1, seatGrid, extendedRule)
		adjacentOccupiedSeats += isAdjacentSeatOccupied(x, y, dx, -1, seatGrid, extendedRule)
	}
	adjacentOccupiedSeats += isAdjacentSeatOccupied(x, y, 1, 0, seatGrid, extendedRule)
	adjacentOccupiedSeats += isAdjacentSeatOccupied(x, y, -1, 0, seatGrid, extendedRule)
	return adjacentOccupiedSeats
}

func runSeatRound(seatGrid [][]seat, extendedRule bool) ([][]seat, bool) {
	newSeatGrid := make([][]seat, len(seatGrid))
	madeChange := false
	for y, seatLine := range seatGrid {
		newSeatGrid[y] = make([]seat, len(seatLine))
		for x, s := range seatLine {
			if !s.present {
				continue
			}
			occupied := s.occupied
			adjacentOccupiedSeats := countOccupiedAdjacentSeats(x, y, seatGrid, extendedRule)
			if s.occupied && (adjacentOccupiedSeats >= 5 || (adjacentOccupiedSeats == 4 && !extendedRule)) {
				occupied = false
				madeChange = true
			} else if !s.occupied && adjacentOccupiedSeats == 0 {
				occupied = true
				madeChange = true
			}
			newSeatGrid[y][x] = seat{present: true, occupied: occupied}
		}
	}
	return newSeatGrid, madeChange
}

func countOccupiedSeats(seatGrid [][]seat) int {
	occupiedSeats := 0
	for _, seatLine := range seatGrid {
		for _, s := range seatLine {
			if s.occupied {
				occupiedSeats++
			}
		}
	}
	return occupiedSeats
}

// CountOccupiedSeats runs the seat rounds until no changes are made and returns the number of occupied seats
func CountOccupiedSeats(lines []string) int {
	seatGrid := parseSeats(lines)
	madeChange := true
	for madeChange {
		seatGrid, madeChange = runSeatRound(seatGrid, false)
	}
	return countOccupiedSeats(seatGrid)
}

// CountOccupiedSeatsExtendedRule runs the seat rounds with extended rules and returns the number of occupied seats
func CountOccupiedSeatsExtendedRule(lines []string) int {
	seatMap := parseSeats(lines)
	madeChange := true
	for madeChange {
		seatMap, madeChange = runSeatRound(seatMap, true)
	}
	return countOccupiedSeats(seatMap)
}
