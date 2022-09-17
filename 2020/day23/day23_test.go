package day23

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGetCupOrderAfterMoves(t *testing.T) {
	res, err := GetCupOrderAfterMoves("389125467", 10)
	require.Nil(t, err)
	require.Equal(t, "92658374", res)
	res, err = GetCupOrderAfterMoves("389125467", 100)
	require.Nil(t, err)
	require.Equal(t, "67384529", res)
	res, err = GetCupOrderAfterMoves("318946572", 100)
	require.Nil(t, err)
	require.Equal(t, "52864379", res)
}

func TestGetFirstTwoCupsAfterTenMillionMoves(t *testing.T) {
	res, err := GetFirstTwoCupsAfterTenMillionMoves("389125467")
	require.Nil(t, err)
	require.Equal(t, uint64(149245887792), res)
	res, err = GetFirstTwoCupsAfterTenMillionMoves("318946572")
	require.Nil(t, err)
	require.Equal(t, uint64(11591415792), res)
}
