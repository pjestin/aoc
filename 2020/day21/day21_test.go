package day21

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

func TestCountAllergenFreeIngredients(t *testing.T) {
	res := CountAllergenFreeIngredients(linesTest)
	require.Equal(t, 5, res)
	res = CountAllergenFreeIngredients(lines)
	require.Equal(t, 2779, res)
}

func TestGetDangerousIngredientList(t *testing.T) {
	res := GetDangerousIngredientList(linesTest)
	require.Equal(t, "mxmxvkd,sqjhc,fvjkl", res)
	res = GetDangerousIngredientList(lines)
	require.Equal(t, "lkv,lfcppl,jhsrjlj,jrhvk,zkls,qjltjd,xslr,rfpbpn", res)
}
