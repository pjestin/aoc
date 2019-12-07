const fs = require('fs'),
    path = require('path'),
    inputFilePath = path.join(__dirname, 'mass-input.txt');

function readMassInputs() {
    return fs.readFileSync(inputFilePath, 'utf8')
        .split('\n')
        .map(massLine => parseInt(massLine, 10))
}

function calculateFuelForModule(mass) {
    fuel = Math.floor(mass / 3) - 2;
    if (fuel <= 0) {
        return 0;
    } else {
        return fuel + calculateFuelForModule(fuel);
    }
}

function calculateFuelRequirement() {
    return readMassInputs()
        .map(calculateFuelForModule)
        .reduce((acc, mass) => acc + mass, 0)
}

console.time('calculateFuelRequirement');
let requirement = calculateFuelRequirement();
console.timeEnd('calculateFuelRequirement');
console.log(`Fuel requirement: ${requirement}`)

module.exports = { readMassInputs, calculateFuelForModule, calculateFuelRequirement }
