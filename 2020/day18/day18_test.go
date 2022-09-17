package day18

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

func TestSumOperationResultsEqualPrecedence(t *testing.T) {
	res, err := SumOperationResultsEqualPrecedence(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(26386), res)
	res, err = SumOperationResultsEqualPrecedence(lines)
	require.Nil(t, err)
	require.Equal(t, int64(11004703763391), res)
}

func TestSumOperationResultsDifferentPrecedence(t *testing.T) {
	res, err := SumOperationResultsDifferentPrecedence(linesTest)
	require.Nil(t, err)
	require.Equal(t, int64(693942), res)
	res, err = SumOperationResultsDifferentPrecedence(lines)
	require.Nil(t, err)
	require.Equal(t, int64(290726428573651), res)
}
