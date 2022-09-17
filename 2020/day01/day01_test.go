package day01

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

func TestFindExpenseReportSum(t *testing.T) {
	res, err := FindExpenseReportSum(linesTest)
	require.Nil(t, err)
	require.Equal(t, 514579, res)
	res, err = FindExpenseReportSum(lines)
	require.Nil(t, err)
	require.Equal(t, 145875, res)
}

func TestFindExpenseReportTripleSum(t *testing.T) {
	res, err := FindExpenseReportTripleSum(linesTest)
	require.Nil(t, err)
	require.Equal(t, 241861950, res)
	res, err = FindExpenseReportTripleSum(lines)
	require.Nil(t, err)
	require.Equal(t, 69596112, res)
}
