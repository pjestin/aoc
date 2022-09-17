package day13

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

func TestFindEarliestDeparture(t *testing.T) {
	res, err := FindEarliestDeparture(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(295), res)
	res, err = FindEarliestDeparture(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(153), res)
}

func TestFindSubsequentDepartureTimestamp(t *testing.T) {
	res, err := FindSubsequentDepartureTimestamp(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(1068781), res)
	res, err = FindSubsequentDepartureTimestamp(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(471793476184394), res)
}
