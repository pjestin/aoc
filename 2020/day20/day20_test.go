package day20

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/require"
)

var lines, linesTest, seaMonsterLines []string

func TestMain(m *testing.M) {
	setup()
	os.Exit(m.Run())
}

func setup() {
	linesTest, _ = lib.ReadLines("input-test.txt")
	lines, _ = lib.ReadLines("input.txt")
	seaMonsterLines, _ = lib.ReadLines("sea-monster.txt")
}

func TestGetGridCornerIDProduct(t *testing.T) {
	res, err := GetGridCornerIDProduct(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(20899048083289), res)
	res, err = GetGridCornerIDProduct(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(12519494280967), res)
}

func TestFindSeaMonster(t *testing.T) {
	res, err := FindSeaMonster(linesTest, seaMonsterLines)
	require.Nil(t, err)
	require.Equal(t, 273, res)
	res, err = FindSeaMonster(lines, seaMonsterLines)
	require.Nil(t, err)
	require.Equal(t, 2442, res)
}
