package day10

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/require"
)

var lines, linesTest, linesTest2 []string

func TestMain(m *testing.M) {
	setup()
	os.Exit(m.Run())
}

func setup() {
	linesTest, _ = lib.ReadLines("input-test.txt")
	linesTest2, _ = lib.ReadLines("input-test-2.txt")
	lines, _ = lib.ReadLines("input.txt")
}

func TestFindJoltDistribution(t *testing.T) {
	res, err := FindJoltDistribution(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(35), res)
	res, err = FindJoltDistribution(linesTest2)
	require.Nil(t, err)
	require.Equal(t, uint64(220), res)
	res, err = FindJoltDistribution(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(1876), res)
}

func TestFindNumberOfArrangements(t *testing.T) {
	res, err := FindNumberOfArrangements(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(8), res)
	res, err = FindNumberOfArrangements(linesTest2)
	require.Nil(t, err)
	require.Equal(t, uint64(19208), res)
	res, err = FindNumberOfArrangements(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(14173478093824), res)
}
