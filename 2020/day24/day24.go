package day24

import (
	"github.com/pjestin/aoc2020/lib"
)

var stepToDirectionMap = map[string]lib.Vector{
	"w":  {X: -1, Y: 0},
	"sw": {X: 0, Y: 1},
	"nw": {X: -1, Y: -1},
	"e":  {X: 1, Y: 0},
	"se": {X: 1, Y: 1},
	"ne": {X: 0, Y: -1},
}

func parseTileInstructions(lines []string) [][]string {
	tileInstructions := make([][]string, len(lines))
	for lineIndex, line := range lines {
		var tileInstruction []string
		instructionIndex := 0
		for instructionIndex < len(line) {
			ch := rune(line[instructionIndex])
			if ch == 's' || ch == 'n' {
				tileInstruction = append(tileInstruction, line[instructionIndex:instructionIndex+2])
				instructionIndex += 2
			} else {
				tileInstruction = append(tileInstruction, line[instructionIndex:instructionIndex+1])
				instructionIndex++
			}
		}
		tileInstructions[lineIndex] = tileInstruction
	}
	return tileInstructions
}

func flipTiles(tiles map[string]bool, instructions [][]string) {
	for _, instruction := range instructions {
		position := lib.Vector{X: 0, Y: 0}
		for _, step := range instruction {
			direction := stepToDirectionMap[step]
			position.Add(direction)
		}
		positionString := position.Format()
		_, wasBlack := tiles[positionString]
		if wasBlack {
			delete(tiles, positionString)
		} else {
			tiles[positionString] = true
		}
	}
}

// CountBlackTiles follows the intructions to flip the tiles between white and black, then counts the number of black tiles
func CountBlackTiles(lines []string) int {
	instructions := parseTileInstructions(lines)
	tiles := make(map[string]bool)
	flipTiles(tiles, instructions)
	return len(tiles)
}

func countBlackNeighboors(position lib.Vector, tiles map[string]bool) int {
	count := 0
	for _, direction := range stepToDirectionMap {
		neighboorPosition := lib.Vector{X: position.X, Y: position.Y}
		neighboorPosition.Add(direction)
		_, isBlack := tiles[neighboorPosition.Format()]
		if isBlack {
			count++
		}
	}
	return count
}

func playRound(tiles map[string]bool) map[string]bool {
	minX := int64(^uint(0) >> 1)
	maxX := -minX - 1
	minY := int64(^uint(0) >> 1)
	maxY := -minY - 1
	for positionString := range tiles {
		position, _ := lib.ParseVector(positionString)
		if position.X < minX {
			minX = position.X
		}
		if position.X > maxX {
			maxX = position.X
		}
		if position.Y < minY {
			minY = position.Y
		}
		if position.Y > maxY {
			maxY = position.Y
		}
	}
	nextTiles := make(map[string]bool)
	for x := minX - 1; x <= maxX+1; x++ {
		for y := minY - 1; y <= maxY+1; y++ {
			position := lib.Vector{X: x, Y: y}
			blackNeighboorCount := countBlackNeighboors(position, tiles)
			positionString := position.Format()
			_, isBlack := tiles[positionString]
			if (isBlack && (blackNeighboorCount == 1 || blackNeighboorCount == 2)) || (!isBlack && blackNeighboorCount == 2) {
				nextTiles[positionString] = true
			}
		}
	}
	return nextTiles
}

// TileGameAfter100Moves flips tiles according to input instructions and then plays 100 rounds of game of life
func TileGameAfter100Moves(lines []string) int {
	instructions := parseTileInstructions(lines)
	tiles := make(map[string]bool)
	flipTiles(tiles, instructions)
	for round := 0; round < 100; round++ {
		tiles = playRound(tiles)
	}
	return len(tiles)
}
