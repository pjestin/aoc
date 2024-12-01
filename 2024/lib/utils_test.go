package lib

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestAbs(t *testing.T) {
	require.Equal(t, Abs(2), 2)
	require.Equal(t, Abs(-3), 3)
	require.Equal(t, Abs(0), 0)
}
