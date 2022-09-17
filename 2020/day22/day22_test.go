package day22

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

func TestGetCombatWinningPlayerScore(t *testing.T) {
	res, err := GetCombatWinningPlayerScore(linesTest)
	require.Nil(t, err)
	require.Equal(t, 306, res)
	res, err = GetCombatWinningPlayerScore(lines)
	require.Nil(t, err)
	require.Equal(t, 36257, res)
}

func TestGetRecursiveCombatWinningPlayerScore(t *testing.T) {
	res, err := GetRecursiveCombatWinningPlayerScore(linesTest)
	require.Nil(t, err)
	require.Equal(t, 291, res)
	res, err = GetRecursiveCombatWinningPlayerScore(lines)
	require.Nil(t, err)
	require.Equal(t, 33304, res)
}
