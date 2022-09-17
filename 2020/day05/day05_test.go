package day05

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

func TestCalculateMaxSeatID(t *testing.T) {
	res, err := CalculateMaxSeatID(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(820), res)
	res, err = CalculateMaxSeatID(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(826), res)
}

func TestCalculateMySeatID(t *testing.T) {
	res, err := CalculateMySeatID(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(566), res)
	res, err = CalculateMySeatID(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(678), res)
}
