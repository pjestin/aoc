const fs = require('fs'),
    path = require('path'),
    inputFilePath = path.join(__dirname, 'mass-input.txt');

function readMassInputs() {
    return fs.readFileSync(inputFilePath, 'utf8')
        .split('\n')
        .map(massLine => parseInt(massLine, 10))
}

function calculateFuelRequirementPart1() {
    return readMassInputs()
        .map(mass => Math.floor(mass / 3) - 2)
        .reduce((acc, mass) => acc + mass, 0)
}

function calculateFuelForModule(mass) {
    fuel = Math.floor(mass / 3) - 2;
    if (fuel <= 0) {
        return 0;
    } else {
        return fuel + calculateFuelForModule(fuel);
    }
}

function calculateFuelRequirementPart2() {
    return readMassInputs()
        .map(calculateFuelForModule)
        .reduce((acc, mass) => acc + mass, 0)
}

module.exports = { calculateFuelRequirementPart1, calculateFuelRequirementPart2 }
