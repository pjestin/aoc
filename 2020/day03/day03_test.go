package day03

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

func TestCountTreesInDefaultSlope(t *testing.T) {
	res := CountTreesInDefaultSlope(linesTest)
	require.Equal(t, int64(7), res)
	res = CountTreesInDefaultSlope(lines)
	require.Equal(t, int64(151), res)
}

func TestFindProductOfTreeCountsInSlopes(t *testing.T) {
	res := FindProductOfTreeCountsInSlopes(linesTest)
	require.Equal(t, int64(336), res)
	res = FindProductOfTreeCountsInSlopes(lines)
	require.Equal(t, int64(7540141059), res)
}
