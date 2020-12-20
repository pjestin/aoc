package day20

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

func TestAssembleTiles(t *testing.T) {
	res, err := AssembleTiles(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(20899048083289), res)
	res, err = AssembleTiles(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(12519494280967), res)
}
