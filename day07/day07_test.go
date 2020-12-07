package day07

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

func TestCountCanContainShinyGold(t *testing.T) {
	res, err := CountCanContainShinyGold(linesTest)
	require.Nil(t, err)
	require.Equal(t, 4, res)
	res, err = CountCanContainShinyGold(lines)
	require.Nil(t, err)
	require.Equal(t, 326, res)
}

func TestCountBagsInShinyGold(t *testing.T) {
	res, err := CountBagsInShinyGold(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(32), res)
	res, err = CountBagsInShinyGold(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(5635), res)
}
