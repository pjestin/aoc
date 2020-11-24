package lib

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadLinesSuccess(t *testing.T) {
	lines, err := ReadLines("read_lines_test.txt")
	assert.Nil(t, err)
	assert.Equal(t, lines, []string{"abc", "defg"})
}

func TestReadLinesFailure(t *testing.T) {
	_, err := ReadLines("non_existant_file.txt")
	assert.NotNil(t, err)
}
