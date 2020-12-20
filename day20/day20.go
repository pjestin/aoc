package day20

import (
	"errors"
	"math"
	"strconv"
	"strings"
)

type tile struct {
	id   uint64
	data [][]bool
}

func parseTiles(lines []string) ([]tile, error) {
	var tiles []tile
	currentTile := tile{}
	for _, line := range lines {
		if len(line) == 0 {
			tiles = append(tiles, currentTile)
			currentTile = tile{}
		} else if strings.HasPrefix(line, "Tile") {
			splitLine := strings.Split(line, " ")
			id, err := strconv.ParseUint(splitLine[1][:len(splitLine[1])-1], 10, 64)
			if err != nil {
				return nil, err
			}
			currentTile.id = id
		} else {
			dataLine := make([]bool, len(line))
			for i := range line {
				if rune(line[i]) == '#' {
					dataLine[i] = true
				}
			}
			currentTile.data = append(currentTile.data, dataLine)
		}
	}
	tiles = append(tiles, currentTile)
	return tiles, nil
}

func (t *tile) flip() {
	side := len(t.data)
	flipped := make([][]bool, side)
	for i := 0; i < side; i++ {
		flipped[i] = make([]bool, side)
	}
	for x := 0; x < side; x++ {
		for y := 0; y < side; y++ {
			flipped[y][x] = t.data[x][y]
		}
	}
	t.data = flipped
}

func (t *tile) rotate() {
	side := len(t.data)
	rotated := make([][]bool, side)
	for i := 0; i < side; i++ {
		rotated[i] = make([]bool, side)
	}
	for x := 0; x < side; x++ {
		for y := 0; y < side; y++ {
			rotated[y][x] = t.data[x][side-1-y]
		}
	}
	t.data = rotated
}

func getBorderHash(t tile, edge int) int {
	side := len(t.data)
	borderHash := 0
	for i := 0; i < side; i++ {
		switch edge {
		case 0: // Top
			if t.data[0][i] {
				borderHash++
			}
		case 1: // Right
			if t.data[i][side-1] {
				borderHash++
			}
		case 2: // Bottom
			if t.data[side-1][i] {
				borderHash++
			}
		case 3: // Left
			if t.data[i][0] {
				borderHash++
			}
		}
		borderHash *= 2
	}
	return borderHash
}

func findMatchingTile(t tile, tiles []tile, edge1 int, matchedTileIds map[uint64]bool) tile {
	border1 := getBorderHash(t, edge1)
	for _, otherT := range tiles {
		_, matched := matchedTileIds[otherT.id]
		if matched || otherT.id == t.id {
			continue
		}
		for rotation := 0; rotation < 4; rotation++ {
			edge2 := (edge1 + 2) % 4
			border2 := getBorderHash(otherT, edge2)
			if border1 == border2 {
				return otherT
			}
			otherT.rotate()
		}
		otherT.flip()
		for rotation := 0; rotation < 4; rotation++ {
			edge2 := (edge1 + 2) % 4
			border2 := getBorderHash(otherT, edge2)
			if border1 == border2 {
				return otherT
			}
			otherT.rotate()
		}
		otherT.flip()
	}
	return tile{}
}

func findCorner(tiles []tile) (tile, error) {
	emptyMap := make(map[uint64]bool)
	for _, t := range tiles {
		for rotation := 0; rotation < 4; rotation++ {
			matchingTileEdge0 := findMatchingTile(t, tiles, 0, emptyMap)
			matchingTileEdge1 := findMatchingTile(t, tiles, 1, emptyMap)
			matchingTileEdge2 := findMatchingTile(t, tiles, 2, emptyMap)
			matchingTileEdge3 := findMatchingTile(t, tiles, 3, emptyMap)
			if matchingTileEdge0.data == nil && matchingTileEdge1.data != nil && matchingTileEdge2.data != nil && matchingTileEdge3.data == nil {
				// Border match at right and bottom
				return t, nil
			}
			t.rotate()
		}
		t.flip()
		for rotation := 0; rotation < 4; rotation++ {
			matchingTileEdge0 := findMatchingTile(t, tiles, 0, emptyMap)
			matchingTileEdge1 := findMatchingTile(t, tiles, 1, emptyMap)
			matchingTileEdge2 := findMatchingTile(t, tiles, 2, emptyMap)
			matchingTileEdge3 := findMatchingTile(t, tiles, 3, emptyMap)
			if matchingTileEdge0.data == nil && matchingTileEdge1.data != nil && matchingTileEdge2.data != nil && matchingTileEdge3.data == nil {
				// Border match at right and bottom
				return t, nil
			}
			t.rotate()
		}
		t.flip()
	}
	return tile{}, errors.New("Corner not found")
}

// AssembleTiles flips and rotates input tiles to assemble them together
func AssembleTiles(lines []string) (uint64, error) {
	tiles, err := parseTiles(lines)
	if err != nil {
		return 0, err
	}
	corner, err := findCorner(tiles)
	if err != nil {
		return 0, err
	}
	gridSide := int(math.Sqrt(float64(len(tiles))))
	matchedTileIds := make(map[uint64]bool)
	tileGrid := make([][]tile, gridSide)
	for i := 0; i < gridSide; i++ {
		tileGrid[i] = make([]tile, gridSide)
	}
	tileGrid[0][0] = corner
	matchedTileIds[corner.id] = true
	for x := 1; x < gridSide; x++ {
		leftTile := tileGrid[0][x-1]
		matchingTile := findMatchingTile(leftTile, tiles, 1, matchedTileIds)
		tileGrid[0][x] = matchingTile
		matchedTileIds[matchingTile.id] = true
	}
	for y := 1; y < gridSide; y++ {
		for x := 0; x < gridSide; x++ {
			topTile := tileGrid[y-1][x]
			matchingTile := findMatchingTile(topTile, tiles, 2, matchedTileIds)
			tileGrid[y][x] = matchingTile
			matchedTileIds[matchingTile.id] = true
		}
	}
	return tileGrid[0][0].id * tileGrid[gridSide-1][0].id * tileGrid[gridSide-1][gridSide-1].id * tileGrid[0][gridSide-1].id, nil
}
