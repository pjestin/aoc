package day19

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

func TestCountMatchingMessages(t *testing.T) {
	res, err := CountMatchingMessages(linesTest)
	require.Nil(t, err)
	require.Equal(t, 2, res)
	res, err = CountMatchingMessages(linesTest2)
	require.Nil(t, err)
	require.Equal(t, 3, res)
	res, err = CountMatchingMessages(lines)
	require.Nil(t, err)
	require.Equal(t, 122, res)
}

// func TestCountMatchingMessagesWithRuleFix(t *testing.T) {
// 	res, err := CountMatchingMessagesWithRuleFix(linesTest2)
// 	require.Nil(t, err)
// 	require.Equal(t, 12, res)
// 	res, err = CountMatchingMessagesWithRuleFix(lines)
// 	require.Nil(t, err)
// 	require.Equal(t, 122, res) // 163 too low
// }
