package day16

import (
	"strconv"
	"strings"

	"github.com/pjestin/aoc2020/lib"
)

type fieldRange struct {
	begin int
	end   int
}

type field struct {
	name   string
	ranges []fieldRange
}

func parseTicketLine(line string) ([]int, error) {
	var ticket []int
	splitTicket := strings.Split(line, ",")
	for _, stringTicketField := range splitTicket {
		ticketField, err := strconv.Atoi(stringTicketField)
		if err != nil {
			return nil, err
		}
		ticket = append(ticket, ticketField)
	}
	return ticket, nil
}

func parseTickets(lines []string) ([]field, []int, [][]int, error) {
	index := 0
	var fields []field
	var myTicket []int
	var nearbyTickets [][]int
	for index < len(lines) {
		line := lines[index]
		if len(line) == 0 {
			break
		}
		splitLineOnColum := strings.Split(line, ": ")
		f := field{name: splitLineOnColum[0]}
		splitLine := strings.Split(splitLineOnColum[1], " ")
		for j := 0; j < (len(splitLine)+1)/2; j++ {
			rangeString := splitLine[2*j]
			splitRange := strings.Split(rangeString, "-")
			begin, err := strconv.Atoi(splitRange[0])
			if err != nil {
				return nil, nil, nil, err
			}
			end, err := strconv.Atoi(splitRange[1])
			if err != nil {
				return nil, nil, nil, err
			}
			f.ranges = append(f.ranges, fieldRange{begin: begin, end: end})
		}
		fields = append(fields, f)
		index++
	}
	index++
	for index < len(lines) {
		line := lines[index]
		if len(line) == 0 {
			break
		} else if line == "your ticket:" {
			index++
			continue
		}
		parsedTicket, err := parseTicketLine(line)
		if err != nil {
			return nil, nil, nil, err
		}
		myTicket = parsedTicket
		index++
	}
	index++
	for index < len(lines) {
		line := lines[index]
		if line == "nearby tickets:" {
			index++
			continue
		}
		ticket, err := parseTicketLine(line)
		if err != nil {
			return nil, nil, nil, err
		}
		nearbyTickets = append(nearbyTickets, ticket)
		index++
	}
	return fields, myTicket, nearbyTickets, nil
}

func GetTicketErrorRate(lines []string) (int, error) {
	fields, _, nearbyTickets, err := parseTickets(lines)
	if err != nil {
		return 0, err
	}
	errorRate := 0
	for _, ticket := range nearbyTickets {
		for _, ticketField := range ticket {
			valid := false
			for _, f := range fields {
				match := false
				for _, fieldRange := range f.ranges {
					if ticketField >= fieldRange.begin && ticketField <= fieldRange.end {
						match = true
						break
					}
				}
				if match {
					valid = true
					break
				}
			}
			if !valid {
				errorRate += ticketField
			}
		}
	}
	return errorRate, nil
}

func getValidNearbyTickets(nearbyTickets [][]int, fields []field) [][]int {
	var validNearbyTickets [][]int
	for _, ticket := range nearbyTickets {
		ticketValid := true
		for _, ticketField := range ticket {
			fieldValid := false
			for _, f := range fields {
				match := false
				for _, fieldRange := range f.ranges {
					if ticketField >= fieldRange.begin && ticketField <= fieldRange.end {
						match = true
						break
					}
				}
				if match {
					fieldValid = true
					break
				}
			}
			if !fieldValid {
				ticketValid = false
			}
		}
		if ticketValid {
			validNearbyTickets = append(validNearbyTickets, ticket)
		}
	}
	return validNearbyTickets
}

func getFieldPossibilties(validTickets [][]int, fields []field) [][]int {
	possibilities := make([][]int, len(fields))
	for i := 0; i < len(fields); i++ {
		for j := 0; j < len(fields); j++ {
			possibilities[i] = append(possibilities[i], j)
		}
	}
	for _, ticket := range validTickets {
		for ticketFieldIndex, ticketField := range ticket {
			thisFieldPossibilities := make([]int, 0, len(fields))
			for fieldIndex, f := range fields {
				match := false
				for _, fieldRange := range f.ranges {
					if ticketField >= fieldRange.begin && ticketField <= fieldRange.end {
						match = true
						break
					}
				}
				if match {
					thisFieldPossibilities = append(thisFieldPossibilities, fieldIndex)
				}
			}
			possibilities[ticketFieldIndex] = lib.IntersectionInt(possibilities[ticketFieldIndex], thisFieldPossibilities)
		}
	}
	return possibilities
}

func prunePossibilities(possibilities [][]int) []int {
	fieldMap := make([]int, len(possibilities))
	decodedFields := 0
	for decodedFields != len(possibilities) {
		for fieldIndex := range possibilities {
			if len(possibilities[fieldIndex]) == 1 {
				onlyPossibility := possibilities[fieldIndex][0]
				fieldMap[fieldIndex] = onlyPossibility
				decodedFields++
				for otherFieldIndex := range possibilities {
					possibilities[otherFieldIndex] = lib.RemoveInt(possibilities[otherFieldIndex], onlyPossibility)
				}
			}
		}
	}
	return fieldMap
}

func DecodeMyTicket(lines []string) (uint64, error) {
	fields, myTicket, nearbyTickets, err := parseTickets(lines)
	if err != nil {
		return 0, err
	}
	validNearbyTickets := getValidNearbyTickets(nearbyTickets, fields)
	possibilities := getFieldPossibilties(validNearbyTickets, fields)
	fieldMap := prunePossibilities(possibilities)
	departureProduct := uint64(1)
	for fieldIndex, ticketField := range myTicket {
		f := fields[fieldMap[fieldIndex]]
		if strings.HasPrefix(f.name, "departure") {
			departureProduct *= uint64(ticketField)
		}
	}
	return departureProduct, nil
}
