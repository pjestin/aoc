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
