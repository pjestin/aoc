package lib

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestContainsTrue(t *testing.T) {
	array := []string{"abc", "de", "fg"}
	require.True(t, Contains(array, "de"))
}

func TestContainsFalse(t *testing.T) {
	array := []string{"abc", "de", "fg"}
	require.False(t, Contains(array, "hi"))
}

func TestContainsIntTrue(t *testing.T) {
	array := []int{6672, 1, -8856}
	require.True(t, ContainsInt(array, -8856))
}

func TestContainsIntFalse(t *testing.T) {
	array := []int{6672, 1, -8856}
	require.False(t, ContainsInt(array, 556))
}

func TestIntersectionInt(t *testing.T) {
	a1 := []int{1, 6, 2134, -67}
	a2 := []int{-67, 11325, -7, 6}
	require.Equal(t, []int{6, -67}, IntersectionInt(a1, a2))
}

func TestRemoveInt(t *testing.T) {
	a := []int{1, 77, -35}
	require.Equal(t, []int{-35, 77}, RemoveInt(a, 1))
}
