const fs = require('fs'),
    path = require('path');

const buildReactions = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    const inputReactions = fs.readFileSync(absoluteFilePath, 'utf8').trim().split('\n').map(line => line.split('=>'));
    let reactions = {};
    inputReactions.forEach(reaction => {
        const result = reaction[1].trim();
        const resultArray = result.split(' ');
        let ingredients = {};
        reaction[0].split(',').forEach(ingredient => {
            const ingredientArray = ingredient.trim().split(' ');
            ingredients[ingredientArray[1]] = Number(ingredientArray[0]);
        });
        reactions[resultArray[1]] = {
            quantity: Number(resultArray[0]),
            ingredients: ingredients
        };
    });
    return reactions;
}

const findIngredientInReactions = (reactions, element) => {
    return Object.values(reactions).find(reaction => element in reaction.ingredients);
}

const findOreRequirement = (filePath, target) => {
    let reactions = buildReactions(filePath);
    let ingredients = Object.assign({}, target);
    while (Object.keys(ingredients).length !== 1 || !('ORE' in ingredients)) {
        let elements = Object.keys(ingredients);
        for (let i = 0; i < elements.length; ++i) {
            const element = elements[i];
            if (findIngredientInReactions(reactions, element)) {
                continue;
            }
            let reaction = JSON.parse(JSON.stringify(reactions[element]));
            delete reactions[element];
            const factor = Math.ceil(ingredients[element] / reaction.quantity);
            Object.keys(reaction.ingredients).forEach(ingredientElement => {
                if (!(ingredientElement in ingredients)) {
                    ingredients[ingredientElement] = 0;
                }
                ingredients[ingredientElement] += reaction.ingredients[ingredientElement] * factor;
            });
            delete ingredients[element];
            break;
        }
    }
    return ingredients['ORE'];
}

const findMaxFuel = (filePath, maxOre) => {
    let digitPower = maxOre;
    let number = 0;
    while (digitPower >= 1) {
        for (let digit = 1; digit <= 9; ++digit) {
            const ore = findOreRequirement(filePath, { 'FUEL': number + digit * digitPower });
            if (ore > maxOre) {
                number += (digit - 1) * digitPower;
                break;
            }
        }
        digitPower /= 10;
    }
    return number;
}

module.exports = { findOreRequirement, findMaxFuel };
