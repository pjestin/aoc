package day21

import (
	"strings"

	"github.com/pjestin/aoc2020/lib"
)

type food struct {
	ingredients []string
	allergens   []string
}

func parseFoodList(lines []string) []food {
	foods := make([]food, len(lines))
	for i, line := range lines {
		splitLine := strings.Split(line, " (contains ")
		ingredients := strings.Split(splitLine[0], " ")
		allergenString := strings.Split(splitLine[1], ")")[0]
		allergens := strings.Split(allergenString, ", ")
		foods[i] = food{ingredients: ingredients, allergens: allergens}
	}
	return foods
}

func buildPossibilities(foods []food) map[string][]string {
	possibilities := make(map[string][]string)
	for _, food := range foods {
		for _, allergen := range food.allergens {
			_, present := possibilities[allergen]
			if present {
				possibilities[allergen] = lib.IntersectionString(possibilities[allergen], food.ingredients)
			} else {
				possibilities[allergen] = food.ingredients
			}
		}
	}
	return possibilities
}

func prunePossibilities(possibilities *map[string][]string) {
	matchedAllergens := make(map[string]bool)
	allergens := make([]string, 0, len(*possibilities))
	for allergen := range *possibilities {
		allergens = append(allergens, allergen)
	}
	change := true
	for change {
		change = false
		for _, allergen := range allergens {
			_, matched := matchedAllergens[allergen]
			if !matched && len((*possibilities)[allergen]) == 1 {
				matchedAllergens[allergen] = true
				for _, otherAllergen := range allergens {
					if otherAllergen != allergen {
						(*possibilities)[otherAllergen] = lib.RemoveString((*possibilities)[otherAllergen], allergen)
					}
				}
				change = true
			}
		}
	}
}

func findAllergenFreeIngredientCount(foods []food, possibilities map[string][]string) int {
	count := 0
	for _, food := range foods {
		for _, ingredient := range food.ingredients {
			hasAllergen := false
			for _, mappedIngredients := range possibilities {
				for _, mappedIngredient := range mappedIngredients {
					if mappedIngredient == ingredient {
						hasAllergen = true
						break
					}
				}
				if hasAllergen {
					break
				}
			}
			if !hasAllergen {
				count++
			}
		}
	}
	return count
}

// CountAllergenFreeIngredients builds a map of allergen to ingredient and then counts the ingredients that don't map to an allergen
func CountAllergenFreeIngredients(lines []string) int {
	foods := parseFoodList(lines)
	possibilities := buildPossibilities(foods)
	prunePossibilities(&possibilities)
	return findAllergenFreeIngredientCount(foods, possibilities)
}
