package lib

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestVectorAdd(t *testing.T) {
	v1 := Vector{X: 4356, Y: 977}
	v2 := Vector{X: -866, Y: 52}
	v1.Add(v2)
	require.Equal(t, int64(3490), v1.X)
	require.Equal(t, int64(1029), v1.Y)
}

func TestVectorManhattanDistance(t *testing.T) {
	v1 := Vector{X: 4356, Y: 977}
	v2 := Vector{X: -866, Y: 52}
	require.Equal(t, int64(5333), v1.ManhattanDistance())
	require.Equal(t, int64(918), v2.ManhattanDistance())
}

func TestVectorFormat(t *testing.T) {
	v := Vector{X: -866, Y: 52}
	require.Equal(t, "-866;52", v.Format())
}

func TestParseVectorSuccess(t *testing.T) {
	v, err := ParseVector("54;-909")
	require.Nil(t, err)
	require.Equal(t, Vector{X: 54, Y: -909}, v)
}

func TestParseVectorFailure(t *testing.T) {
	_, err := ParseVector("54,-909")
	require.NotNil(t, err)
}
