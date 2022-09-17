package day25

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestGetEncryptionKey(t *testing.T) {
	res := GetEncryptionKey(5764801, 17807724)
	require.Equal(t, 14897079, res)
	res = GetEncryptionKey(13233401, 6552760)
	require.Equal(t, 17673381, res)
}
