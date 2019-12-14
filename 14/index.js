const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'input.txt'),
    INPUT_REACTIONS = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split('\n').map(line => line.split('=>'));

const buildReactions = () => {
    let reactions = {};
    INPUT_REACTIONS.forEach(reaction => {
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

const findOreRequirement = (inputReactions, target) => {
    let reactions = Object.assign({}, inputReactions);
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

const findMaxFuel = (reactions, maxOre) => {
    let digitPower = maxOre;
    let number = 0;
    while (digitPower >= 1) {
        for (let digit = 1; digit <= 9; ++digit) {
            const ore = findOreRequirement(reactions, { 'FUEL': number + digit * digitPower });
            if (ore > maxOre) {
                number += (digit - 1) * digitPower;
                break;
            }
        }
        digitPower /= 10;
    }
    return number;
}

const reactions = buildReactions();
console.log(findOreRequirement(reactions, { 'FUEL': 1 }));
console.log(findMaxFuel(reactions, Math.pow(10, 12)));
