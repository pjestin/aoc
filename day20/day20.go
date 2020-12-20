package day20

import (
	"errors"
	"math"
	"strconv"
	"strings"

	"github.com/pjestin/aoc2020/lib"
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

func flip(data [][]bool) [][]bool {
	side := len(data)
	flipped := make([][]bool, side)
	for i := 0; i < side; i++ {
		flipped[i] = make([]bool, side)
	}
	for x := 0; x < side; x++ {
		for y := 0; y < side; y++ {
			flipped[y][x] = data[x][y]
		}
	}
	return flipped
}

func rotate(data [][]bool) [][]bool {
	side := len(data)
	rotated := make([][]bool, side)
	for i := 0; i < side; i++ {
		rotated[i] = make([]bool, side)
	}
	for x := 0; x < side; x++ {
		for y := 0; y < side; y++ {
			rotated[y][x] = data[x][side-1-y]
		}
	}
	return rotated
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
		for flipping := 0; flipping < 2; flipping++ {
			for rotation := 0; rotation < 4; rotation++ {
				edge2 := (edge1 + 2) % 4
				border2 := getBorderHash(otherT, edge2)
				if border1 == border2 {
					return otherT
				}
				otherT.data = rotate(otherT.data)
			}
			otherT.data = flip(otherT.data)
		}
	}
	return tile{}
}

func findCorner(tiles []tile) (tile, error) {
	emptyMap := make(map[uint64]bool)
	for _, t := range tiles {
		for flipping := 0; flipping < 2; flipping++ {
			for rotation := 0; rotation < 4; rotation++ {
				matchingTileEdge0 := findMatchingTile(t, tiles, 0, emptyMap)
				matchingTileEdge1 := findMatchingTile(t, tiles, 1, emptyMap)
				matchingTileEdge2 := findMatchingTile(t, tiles, 2, emptyMap)
				matchingTileEdge3 := findMatchingTile(t, tiles, 3, emptyMap)
				if matchingTileEdge0.data == nil && matchingTileEdge1.data != nil && matchingTileEdge2.data != nil && matchingTileEdge3.data == nil {
					// Border match at right and bottom
					return t, nil
				}
				t.data = rotate(t.data)
			}
			t.data = flip(t.data)
		}
	}
	return tile{}, errors.New("Corner not found")
}

func assembleTiles(tiles []tile) ([][]tile, error) {
	corner, err := findCorner(tiles)
	if err != nil {
		return nil, err
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
	return tileGrid, nil
}

// GetGridCornerIdProduct flips and rotates input tiles to assemble them together
func GetGridCornerIdProduct(lines []string) (uint64, error) {
	tiles, err := parseTiles(lines)
	if err != nil {
		return 0, err
	}
	tileGrid, err := assembleTiles(tiles)
	gridSide := len(tileGrid)
	return tileGrid[0][0].id * tileGrid[gridSide-1][0].id * tileGrid[gridSide-1][gridSide-1].id * tileGrid[0][gridSide-1].id, nil
}

func formImage(tileGrid [][]tile) [][]bool {
	tileSide := len(tileGrid[0][0].data)
	gridSide := len(tileGrid)
	image := make([][]bool, gridSide*(tileSide-2))
	for i := 0; i < gridSide*(tileSide-2); i++ {
		image[i] = make([]bool, gridSide*(tileSide-2))
	}
	for tileX := 0; tileX < gridSide; tileX++ {
		for tileY := 0; tileY < gridSide; tileY++ {
			for x := 1; x < tileSide-1; x++ {
				for y := 1; y < tileSide-1; y++ {
					image[tileY*(tileSide-2)+y-1][tileX*(tileSide-2)+x-1] = tileGrid[tileY][tileX].data[y][x]
				}
			}
		}
	}
	return image
}

func parseSeaMonsterPattern(seaMonsterLines []string) []lib.Vector {
	var pattern []lib.Vector
	for y := int64(0); y < int64(len(seaMonsterLines)); y++ {
		for x := int64(0); x < int64(len(seaMonsterLines[0])); x++ {
			if rune(seaMonsterLines[y][x]) == '#' {
				pattern = append(pattern, lib.Vector{X: x, Y: y})
			}
		}
	}
	return pattern
}

func findSeaMonsterMatch(image [][]bool, seaMonsterPattern []lib.Vector) bool {
	imageSize := len(image)
	for startX := 0; startX <= imageSize-20; startX++ {
		for startY := 0; startY <= imageSize-3; startY++ {
			match := true
			for _, seaMonsterPosition := range seaMonsterPattern {
				if !image[startY+int(seaMonsterPosition.Y)][startX+int(seaMonsterPosition.X)] {
					match = false
				}
			}
			if match {
				return true
			}
		}
	}
	return false
}

func countNonMonsterActiveTiles(image [][]bool, seaMonsterPattern []lib.Vector) int {
	imageSize := int64(len(image))
	for startX := int64(0); startX < imageSize-20; startX++ {
		for startY := int64(0); startY < imageSize-3; startY++ {
			match := true
			for _, seaMonsterPosition := range seaMonsterPattern {
				if !image[startY+seaMonsterPosition.Y][startX+seaMonsterPosition.X] {
					match = false
				}
			}
			if match {
				for _, seaMonsterPosition := range seaMonsterPattern {
					image[startY+seaMonsterPosition.Y][startX+seaMonsterPosition.X] = false
				}
			}
		}
	}
	count := 0
	for x := int64(0); x < imageSize; x++ {
		for y := int64(0); y < imageSize; y++ {
			if image[y][x] {
				count++
			}
		}
	}
	return count
}

// FindSeaMonster looks in the assembled image for the sea monster and returns non-sea-monster tiles
func FindSeaMonster(lines []string, seaMonsterLines []string) (int, error) {
	tiles, err := parseTiles(lines)
	if err != nil {
		return 0, err
	}
	tileGrid, err := assembleTiles(tiles)
	image := formImage(tileGrid)
	seaMonsterPattern := parseSeaMonsterPattern(seaMonsterLines)
	for flipping := 0; flipping < 2; flipping++ {
		for rotation := 0; rotation < 4; rotation++ {
			if findSeaMonsterMatch(image, seaMonsterPattern) {
				return countNonMonsterActiveTiles(image, seaMonsterPattern), nil
			}
			image = rotate(image)
		}
		image = flip(image)
	}
	return 0, errors.New("Sea monster not found")
}
