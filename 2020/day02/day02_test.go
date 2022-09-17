package day02

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

func TestValidatePasswordsPart1(t *testing.T) {
	res, err := ValidatePasswordsPart1(linesTest)
	require.Nil(t, err)
	require.Equal(t, 2, res)
	res, err = ValidatePasswordsPart1(lines)
	require.Nil(t, err)
	require.Equal(t, 643, res)
}

func TestValidatePasswordsPart2(t *testing.T) {
	res, err := ValidatePasswordsPart2(linesTest)
	require.Nil(t, err)
	require.Equal(t, 1, res)
	res, err = ValidatePasswordsPart2(lines)
	require.Nil(t, err)
	require.Equal(t, 388, res)
}
