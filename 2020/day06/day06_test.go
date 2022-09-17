package day06

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

func TestSumGroupYesQuestionsUnion(t *testing.T) {
	res := SumGroupYesQuestionsUnion(linesTest)
	require.Equal(t, 11, res)
	res = SumGroupYesQuestionsUnion(lines)
	require.Equal(t, 6903, res)
}

func TestSumGroupYesQuestionsIntersection(t *testing.T) {
	res := SumGroupYesQuestionsIntersection(linesTest)
	require.Equal(t, 6, res)
	res = SumGroupYesQuestionsIntersection(lines)
	require.Equal(t, 3493, res)
}
