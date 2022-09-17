package day12

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

func TestGetShipDistance(t *testing.T) {
	res, err := GetShipDistance(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(25), res)
	res, err = GetShipDistance(lines)
	require.Nil(t, err)
	require.Equal(t, int64(1482), res)
}

func TestGetShipDistanceUsingWaypoint(t *testing.T) {
	res, err := GetShipDistanceUsingWaypoint(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(286), res)
	res, err = GetShipDistanceUsingWaypoint(lines)
	require.Nil(t, err)
	require.Equal(t, int64(48739), res)
}
