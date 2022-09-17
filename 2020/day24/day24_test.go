package day24

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/require"
)

var lines, linesTest []string

func TestMain(m *testing.M) {
	setup()
	os.Exit(m.Run())
}

func setup() {
	linesTest, _ = lib.ReadLines("input-test.txt")
	lines, _ = lib.ReadLines("input.txt")
}

func TestCountBlackTiles(t *testing.T) {
	res := CountBlackTiles(linesTest)
	require.Equal(t, 10, res)
	res = CountBlackTiles(lines)
	require.Equal(t, 495, res)
}

func TestTileGameAfter100Moves(t *testing.T) {
	res := TileGameAfter100Moves(linesTest)
	require.Equal(t, 2208, res)
	res = TileGameAfter100Moves(lines)
	require.Equal(t, 4012, res)
}
