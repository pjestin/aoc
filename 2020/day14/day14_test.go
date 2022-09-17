package day14

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/require"
)

var lines, linesTest, linesTest2 []string

func TestMain(m *testing.M) {
	setup()
	os.Exit(m.Run())
}

func setup() {
	linesTest, _ = lib.ReadLines("input-test.txt")
	linesTest2, _ = lib.ReadLines("input-test-2.txt")
	lines, _ = lib.ReadLines("input.txt")
}

func TestRunBitMaskProgram(t *testing.T) {
	res, err := RunBitMaskProgram(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(165), res)
	res, err = RunBitMaskProgram(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(6317049172545), res)
}

func TestRunBitMaskProgramVersion2(t *testing.T) {
	res, err := RunBitMaskProgramVersion2(linesTest2)
	require.Nil(t, err)
	require.Equal(t, uint64(208), res)
	res, err = RunBitMaskProgramVersion2(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(3434009980379), res)
}
