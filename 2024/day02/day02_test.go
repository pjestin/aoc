package day02

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

func TestCountSafeReports(t *testing.T) {
	res, err := CountSafeReports(linesTest)
	require.Nil(t, err)
	require.Equal(t, 2, res)
	res, err = CountSafeReports(lines)
	require.Nil(t, err)
	require.Equal(t, 236, res)
}

func TestCountSafeReportsWithPD(t *testing.T) {
	res, err := CountSafeReportsWithPD(linesTest)
	require.Nil(t, err)
	require.Equal(t, 4, res)
	res, err = CountSafeReportsWithPD(lines)
	require.Nil(t, err)
	require.Equal(t, 308, res)
}
