package day07

import (
	"errors"
	"regexp"
	"strconv"
	"strings"
)

type luggageAssociation struct {
	luggage      *luggageGraphNode
	multiplicity uint64
}

type luggageGraphNode struct {
	name        string
	contains    []luggageAssociation
	containedBy []luggageAssociation
}

func parseLuggageGraph(lines []string) (map[string]*luggageGraphNode, error) {
	graphMap := make(map[string]*luggageGraphNode)
	bagGroupPattern, err := regexp.Compile("^(\\w+ \\w+) bags contain ((?:\\d+ \\w+ \\w+ bags?,? ?)+).$")
	if err != nil {
		return nil, err
	}
	bagPattern, err := regexp.Compile("(\\d+) (\\w+ \\w+) bag")
	if err != nil {
		return nil, err
	}
	for _, line := range lines {
		bagGroupMatch := bagGroupPattern.FindStringSubmatch(line)
		if bagGroupMatch == nil {
			continue
		}
		bagName := bagGroupMatch[1]
		bagNode, present := graphMap[bagName]
		if !present {
			bagNode = &luggageGraphNode{name: bagName}
		}
		containedBagGroups := strings.Split(bagGroupMatch[2], ",")
		for _, containedBagGroup := range containedBagGroups {
			bagMatch := bagPattern.FindStringSubmatch(containedBagGroup)
			if bagMatch == nil {
				return nil, errors.New("No regex matches bag group")
			}
			multiplicity, err := strconv.ParseUint(bagMatch[1], 10, 64)
			if err != nil {
				return nil, err
			}
			containedBagName := bagMatch[2]
			containedBag, present := graphMap[containedBagName]
			if !present {
				containedBag = &luggageGraphNode{name: containedBagName}
			}
			bagNode.contains = append(bagNode.contains, luggageAssociation{multiplicity: multiplicity, luggage: containedBag})
			containedBag.containedBy = append(containedBag.containedBy, luggageAssociation{multiplicity: multiplicity, luggage: bagNode})
			graphMap[containedBagName] = containedBag
		}
		graphMap[bagName] = bagNode
	}
	return graphMap, nil
}

func buildContainingBagSet(luggage string, currentNode *luggageGraphNode) map[string]bool {
	bagSet := make(map[string]bool)
	if currentNode.name != luggage {
		_, present := bagSet[currentNode.name]
		if present {
			return bagSet
		}
		bagSet[currentNode.name] = true
	}
	for _, containedBy := range currentNode.containedBy {
		thisBagSet := buildContainingBagSet(luggage, containedBy.luggage)
		for bag := range thisBagSet {
			bagSet[bag] = true
		}
	}
	return bagSet
}

func countBags(currentNode *luggageGraphNode) uint64 {
	sum := uint64(1)
	for _, containedLuggageAssociation := range currentNode.contains {
		sum += containedLuggageAssociation.multiplicity * countBags(containedLuggageAssociation.luggage)
	}
	return sum
}

// CountCanContainShinyGold goes through the luggage graph to find all luggages that can contain (directly or indirectly) a shiny gold bag
func CountCanContainShinyGold(lines []string) (int, error) {
	luggageGraph, err := parseLuggageGraph(lines)
	if err != nil {
		return 0, err
	}
	startNode := luggageGraph["shiny gold"]
	bagSet := buildContainingBagSet("shiny gold", startNode)
	return len(bagSet), nil
}

// CountBagsInShinyGold goes through the luggage that is contained in a shiny gold bag and counts them
func CountBagsInShinyGold(lines []string) (uint64, error) {
	luggageGraph, err := parseLuggageGraph(lines)
	if err != nil {
		return 0, err
	}
	startNode := luggageGraph["shiny gold"]
	return countBags(startNode) - 1, nil
}
