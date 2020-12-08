package day08

import (
	"errors"
	"strconv"
	"strings"
)

type instruction struct {
	operation string
	argument  int64
}

func parseInstructions(lines []string) ([]*instruction, error) {
	var instructions []*instruction
	for _, line := range lines {
		splitLine := strings.Split(line, " ")
		arg, err := strconv.ParseInt(splitLine[1], 10, 64)
		if err != nil {
			return nil, err
		}
		ins := instruction{operation: splitLine[0], argument: arg}
		instructions = append(instructions, &ins)
	}
	return instructions, nil
}

func tryProgram(instructions []*instruction) (int64, error) {
	var index int64
	var acc int64
	visitedIndices := make(map[int64]bool)
	for index < int64(len(instructions)) {
		_, present := visitedIndices[index]
		if present {
			return acc, errors.New("Program is broken")
		}
		visitedIndices[index] = true
		switch instructions[index].operation {
		case "nop":
			index++
		case "acc":
			acc += instructions[index].argument
			index++
		case "jmp":
			index += instructions[index].argument
		}
	}
	return acc, nil
}

func switchOperation(ins *instruction) {
	if ins.operation == "nop" {
		ins.operation = "jmp"
	} else {
		ins.operation = "nop"
	}
}

// InspectInfiniteLoop runs the program and stops at the first already visited index
func InspectInfiniteLoop(lines []string) (int64, error) {
	instructions, err := parseInstructions(lines)
	if err != nil {
		return 0, err
	}
	acc, err := tryProgram(instructions)
	return acc, nil
}

// RepairProgram goes through each instruction and tries to replace a jmp with a nop or the reverse to repair the program
func RepairProgram(lines []string) (int64, error) {
	instructions, err := parseInstructions(lines)
	if err != nil {
		return 0, err
	}
	for indexToRepair := range instructions {
		ins := instructions[indexToRepair]
		if ins.operation == "nop" || ins.operation == "jmp" {
			switchOperation(ins)
			acc, err := tryProgram(instructions)
			if err == nil {
				return acc, nil
			}
			switchOperation(ins)
		}
	}
	return 0, errors.New("Program could not be fixed")
}
