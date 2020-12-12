package day11

import "github.com/pjestin/aoc2020/lib"

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

func isAdjacentSeatOccupied(position lib.Vector, direction lib.Vector, seatGrid [][]seat, checkFirstVisibleSeat bool) bool {
	position.Add(direction)
	if checkFirstVisibleSeat {
		for position.X >= 0 && position.X < int64(len(seatGrid[0])) && position.Y >= 0 && position.Y < int64(len(seatGrid)) {
			if seatGrid[position.Y][position.X].occupied {
				return true
			} else if seatGrid[position.Y][position.X].present {
				return false
			}
			position.Add(direction)
		}
		return false
	}
	if position.X >= 0 && position.X < int64(len(seatGrid[0])) && position.Y >= 0 && position.Y < int64(len(seatGrid)) && seatGrid[position.Y][position.X].occupied {
		return true
	}
	return false
}

func countOccupiedAdjacentSeats(v lib.Vector, seatGrid [][]seat, extendedRule bool) int {
	adjacentOccupiedSeats := 0
	directions := []lib.Vector{{X: -1, Y: -1}, {X: -1, Y: 0}, {X: -1, Y: 1}, {X: 0, Y: -1}, {X: 0, Y: 1}, {X: 1, Y: -1}, {X: 1, Y: 0}, {X: 1, Y: 1}}
	for _, direction := range directions {
		if isAdjacentSeatOccupied(v, direction, seatGrid, extendedRule) {
			adjacentOccupiedSeats++
		}
	}
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
			adjacentOccupiedSeats := countOccupiedAdjacentSeats(lib.Vector{X: int64(x), Y: int64(y)}, seatGrid, extendedRule)
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
