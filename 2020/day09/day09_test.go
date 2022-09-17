package day09

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

func TestFindFirstInvalidNumber(t *testing.T) {
	res, err := FindFirstInvalidNumber(linesTest, 5)
	require.Nil(t, err)
	require.Equal(t, uint64(127), res)
	res, err = FindFirstInvalidNumber(lines, 25)
	require.Nil(t, err)
	require.Equal(t, uint64(69316178), res)
}

func TestFindTargetSumContiguousSet(t *testing.T) {
	res, err := FindTargetSumContiguousSet(linesTest, 5)
	require.Nil(t, err)
	require.Equal(t, uint64(62), res)
	res, err = FindTargetSumContiguousSet(lines, 25)
	require.Nil(t, err)
	require.Equal(t, uint64(9351526), res)
}
