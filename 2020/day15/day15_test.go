package day15

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGetMemoryGameNthNumber2020(t *testing.T) {
	res := GetMemoryGameNthNumber([]uint32{0, 3, 6}, 2020)
	require.Equal(t, uint32(436), res)
	res = GetMemoryGameNthNumber([]uint32{19, 20, 14, 0, 9, 1}, 2020)
	require.Equal(t, uint32(1325), res)
}

func TestGetMemoryGameNthNumber30000000(t *testing.T) {
	res := GetMemoryGameNthNumber([]uint32{0, 3, 6}, 30000000)
	require.Equal(t, uint32(175594), res)
	res = GetMemoryGameNthNumber([]uint32{19, 20, 14, 0, 9, 1}, 30000000)
	require.Equal(t, uint32(59006), res)
}
