package day21

import (
	"sort"
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

func prunePossibilities(possibilities map[string][]string) map[string]string {
	allergenIngredientMap := make(map[string]string)
	allergens := make([]string, 0, len(possibilities))
	for allergen := range possibilities {
		allergens = append(allergens, allergen)
	}
	for len(allergenIngredientMap) < len(possibilities) {
		for _, allergen := range allergens {
			if len(possibilities[allergen]) == 1 {
				onlyPossibility := possibilities[allergen][0]
				allergenIngredientMap[allergen] = onlyPossibility
				for _, otherAllergen := range allergens {
					possibilities[otherAllergen] = lib.RemoveString(possibilities[otherAllergen], onlyPossibility)
				}
			}
		}
	}
	return allergenIngredientMap
}

func findAllergenFreeIngredientCount(foods []food, allergenIngredientMap map[string]string) int {
	count := 0
	for _, food := range foods {
		for _, ingredient := range food.ingredients {
			hasAllergen := false
			for _, mappedIngredient := range allergenIngredientMap {
				if mappedIngredient == ingredient {
					hasAllergen = true
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
	allergenIngredientMap := prunePossibilities(possibilities)
	return findAllergenFreeIngredientCount(foods, allergenIngredientMap)
}

func getSortedIngredientList(allergenIngredientMap map[string]string) string {
	sortedAllergens := make([]string, 0, len(allergenIngredientMap))
	for allergen := range allergenIngredientMap {
		sortedAllergens = append(sortedAllergens, allergen)
	}
	sort.Slice(sortedAllergens, func(i, j int) bool { return sortedAllergens[i] < sortedAllergens[j] })
	ingredients := make([]string, 0, len(sortedAllergens))
	for _, allergen := range sortedAllergens {
		ingredients = append(ingredients, allergenIngredientMap[allergen])
	}
	return strings.Join(ingredients, ",")
}

// GetDangerousIngredientList builds the allergen to ingredient map, then returns a comma-separated list of dangerous ingredients
func GetDangerousIngredientList(lines []string) string {
	foods := parseFoodList(lines)
	possibilities := buildPossibilities(foods)
	allergenIngredientMap := prunePossibilities(possibilities)
	return getSortedIngredientList(allergenIngredientMap)
}
