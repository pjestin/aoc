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
	require.Equal(t, "36257", res) // 269715384 too high, 53842697 too high
}
