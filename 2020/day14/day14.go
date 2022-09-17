package day14

import (
	"fmt"
	"strconv"
	"strings"
)

type instruction struct {
	bitMask string
	address uint64
	value   uint64
}

func parseProgramInstructions(lines []string) ([]instruction, error) {
	var instructions []instruction
	for _, line := range lines {
		splitLine := strings.Split(line, " = ")
		if strings.Contains(line, "[") {
			value, err := strconv.ParseUint(splitLine[1], 10, 64)
			if err != nil {
				return nil, err
			}
			address, err := strconv.ParseUint(strings.Split(strings.Split(splitLine[0], "[")[1], "]")[0], 10, 64)
			if err != nil {
				return nil, err
			}
			instructions = append(instructions, instruction{address: address, value: value})
		} else {
			instructions = append(instructions, instruction{bitMask: splitLine[1]})
		}
	}
	return instructions, nil
}

func RunBitMaskProgram(lines []string) (uint64, error) {
	instructions, err := parseProgramInstructions(lines)
	if err != nil {
		return 0, err
	}
	registers := make(map[uint64]uint64)
	var bitMask string
	for _, ins := range instructions {
		if len(ins.bitMask) != 0 {
			bitMask = ins.bitMask
		} else {
			bitMaskAnd := strings.Replace(bitMask, "X", "1", -1)
			bitMaskAndParsed, err := strconv.ParseUint(bitMaskAnd, 2, 64)
			if err != nil {
				return 0, err
			}
			bitMaskOr := strings.Replace(bitMask, "X", "0", -1)
			bitMaskOrParsed, err := strconv.ParseUint(bitMaskOr, 2, 64)
			if err != nil {
				return 0, err
			}
			registers[ins.address] = (ins.value & bitMaskAndParsed) | bitMaskOrParsed
		}
	}
	var sum uint64
	for _, value := range registers {
		sum += value
	}
	return sum, nil
}

func findAddressesForBitMask(bitMask string) ([]uint64, error) {
	if !strings.Contains(bitMask, "X") {
		value, err := strconv.ParseUint(bitMask, 2, 64)
		if err != nil {
			return nil, err
		}
		return []uint64{value}, nil
	}
	var addresses []uint64
	bitMaskWith1 := strings.Replace(bitMask, "X", "1", 1)
	addressesWith1, err := findAddressesForBitMask(bitMaskWith1)
	if err != nil {
		return nil, err
	}
	addresses = append(addresses, addressesWith1...)
	bitMaskWith0 := strings.Replace(bitMask, "X", "0", 1)
	addressesWith0, err := findAddressesForBitMask(bitMaskWith0)
	if err != nil {
		return nil, err
	}
	return append(addresses, addressesWith0...), nil
}

func RunBitMaskProgramVersion2(lines []string) (uint64, error) {
	instructions, err := parseProgramInstructions(lines)
	if err != nil {
		return 0, err
	}
	registers := make(map[uint64]uint64)
	var bitMask string
	for _, ins := range instructions {
		if len(ins.bitMask) != 0 {
			bitMask = ins.bitMask
		} else {
			binaryValue := fmt.Sprintf("%036v", strconv.FormatUint(ins.address, 2))
			floatingAddressArray := []rune(bitMask)
			for index, bit := range floatingAddressArray {
				if rune(bit) == '0' {
					floatingAddressArray[index] = rune(binaryValue[index])
				}
			}
			floatingAddress := string(floatingAddressArray)
			addresses, err := findAddressesForBitMask(floatingAddress)
			if err != nil {
				return 0, err
			}
			for _, address := range addresses {
				registers[address] = ins.value
			}
		}
	}
	var sum uint64
	for _, value := range registers {
		sum += value
	}
	return sum, nil
}
