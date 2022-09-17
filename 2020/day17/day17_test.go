package day17

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

func TestGetCubesAfterCycles2D(t *testing.T) {
	res := GetCubesAfterCycles(linesTest, 2)
	require.Equal(t, 5, res)
	res = GetCubesAfterCycles(lines, 2)
	require.Equal(t, 7, res)
}

func TestGetCubesAfterCycles3D(t *testing.T) {
	res := GetCubesAfterCycles(linesTest, 3)
	require.Equal(t, 112, res)
	res = GetCubesAfterCycles(lines, 3)
	require.Equal(t, 218, res)
}
