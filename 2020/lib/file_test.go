package lib

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestReadLinesSuccess(t *testing.T) {
	lines, err := ReadLines("read_lines_test.txt")
	require.Nil(t, err)
	require.Equal(t, lines, []string{"abc", "defg"})
}

func TestReadLinesFailure(t *testing.T) {
	_, err := ReadLines("non_existant_file.txt")
	require.NotNil(t, err)
}
