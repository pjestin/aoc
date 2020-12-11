package day11

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

// func TestCountOccupiedSeats(t *testing.T) {
// 	res := CountOccupiedSeats(linesTest)
// 	require.Equal(t, 37, res)
// 	res = CountOccupiedSeats(lines)
// 	require.Equal(t, 2299, res)
// }

func TestCountOccupiedSeatsExtendedRule(t *testing.T) {
	res := CountOccupiedSeatsExtendedRule(linesTest)
	require.Equal(t, 26, res)
	res = CountOccupiedSeatsExtendedRule(lines)
	require.Equal(t, 2047, res)
}
