package day16

import (
	"os"
	"testing"

	"github.com/pjestin/aoc2020/lib"
	"github.com/stretchr/testify/require"
)

var lines, linesTest []string

func TestMain(m *testing.M) {
	setup()
	os.Exit(m.Run())
}

func setup() {
	linesTest, _ = lib.ReadLines("input-test.txt")
	lines, _ = lib.ReadLines("input.txt")
}

func TestGetTicketErrorRate(t *testing.T) {
	res, err := GetTicketErrorRate(linesTest)
	require.Nil(t, err)
	require.Equal(t, 71, res)
	res, err = GetTicketErrorRate(lines)
	require.Nil(t, err)
	require.Equal(t, 18142, res)
}

func TestDecodeMyTicket(t *testing.T) {
	res, err := DecodeMyTicket(linesTest)
	require.Nil(t, err)
	require.Equal(t, uint64(1), res)
	res, err = DecodeMyTicket(lines)
	require.Nil(t, err)
	require.Equal(t, uint64(1069784384303), res)
}
