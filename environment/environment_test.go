package environment

import (
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/assert"
)

func TestChecksum(t *testing.T) {
	lines, err := lib.ReadLines("input.txt")
	assert.Nil(t, err)
	assert.Equal(t, Checksum(lines), 6370)
}
