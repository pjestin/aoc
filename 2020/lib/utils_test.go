package lib

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestContainsIntTrue(t *testing.T) {
	array := []int{6672, 1, -8856}
	require.True(t, ContainsInt(array, -8856))
}

func TestContainsIntFalse(t *testing.T) {
	array := []int{6672, 1, -8856}
	require.False(t, ContainsInt(array, 556))
}

func TestContainsStringTrue(t *testing.T) {
	array := []string{"abc", "de", "fg"}
	require.True(t, ContainsString(array, "de"))
}

func TestContainsStringFalse(t *testing.T) {
	array := []string{"abc", "de", "fg"}
	require.False(t, ContainsString(array, "hi"))
}

func TestIntersectionInt(t *testing.T) {
	a1 := []int{1, 6, 2134, -67}
	a2 := []int{-67, 11325, -7, 6}
	require.Equal(t, []int{6, -67}, IntersectionInt(a1, a2))
}

func TestIntersectionString(t *testing.T) {
	a1 := []string{"1", "hasas5t", "g-wsgh", "hszj"}
	a2 := []string{"hjkiu", "g-wsgh", "1", ""}
	require.Equal(t, []string{"1", "g-wsgh"}, IntersectionString(a1, a2))
}

func TestRemoveInt(t *testing.T) {
	a := []int{1, 77, -35}
	require.Equal(t, []int{-35, 77}, RemoveInt(a, 1))
}

func TestRemoveString(t *testing.T) {
	a := []string{"hahj", "loout", "e324ytg"}
	require.Equal(t, []string{"hahj", "e324ytg"}, RemoveString(a, "loout"))
}
