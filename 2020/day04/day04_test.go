package day04

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

func TestCountValidPassports(t *testing.T) {
	res := CountValidPassports(linesTest)
	require.Equal(t, 2, res)
	res = CountValidPassports(lines)
	require.Equal(t, 206, res)
}

func TestCountValidPassportsData(t *testing.T) {
	res := CountValidPassportsData(linesTest)
	require.Equal(t, 2, res)
	res = CountValidPassportsData(lines)
	require.Equal(t, 123, res)
}
