package day08

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

func TestInspectInfiniteLoop(t *testing.T) {
	res, err := InspectInfiniteLoop(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(5), res)
	res, err = InspectInfiniteLoop(lines)
	require.Nil(t, err)
	require.Equal(t, int64(1487), res)
}

func TestRepairProgram(t *testing.T) {
	res, err := RepairProgram(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(8), res)
	res, err = RepairProgram(lines)
	require.Nil(t, err)
	require.Equal(t, int64(1607), res)
}
