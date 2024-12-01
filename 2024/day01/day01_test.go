package day01

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2024/lib"
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

func TestSumDistances(t *testing.T) {
	res, err := SumDistances(linesTest)
	require.Nil(t, err)
	require.Equal(t, 11, res)
	res, err = SumDistances(lines)
	require.Nil(t, err)
	require.Equal(t, 1341714, res)
}

func TestFindSimilarityScore(t *testing.T) {
	res, err := FindSimilarityScore(linesTest)
	require.Nil(t, err)
	require.Equal(t, 31, res)
	res, err = FindSimilarityScore(lines)
	require.Nil(t, err)
	require.Equal(t, 27384707, res)
}
