const path = require('path'),
    intcode = require('../lib/intcode');

function getCombinations(codes) {
    if (codes.length === 1) {
        return [[codes[0]]];
    }
    const code = codes.pop();
    let combinations = [];
    const combinationsWithout = getCombinations(codes);
    combinationsWithout.forEach(combinationWithout => {
        for (let i = 0; i <= combinationWithout.length; ++i) {
            let combinationWith = Array.from(combinationWithout);
            combinationWith.splice(i, 0, code);
            combinations.push(combinationWith);
        }
    });
    return combinations;
}

function runCombinationPart1(inputIntcode, phaseCodes) {
    let computers = phaseCodes.map(phaseCode => {
        return {
            memory: Object.assign({}, inputIntcode),
            input: [phaseCode],
            index: 0
        }
    });
    computers[0].input.push(0);
    for (let computerIndex = 0; computerIndex < 5; ++computerIndex) {
        intcode.runIntcode(computers[computerIndex]);
        if (computerIndex < 4) {
            computers[computerIndex + 1].input.push(computers[computerIndex].output);
        }
    }
    return computers[4].output;
}

function runCombinationPart2(inputIntcode, phaseCodes) {
    let computers = phaseCodes.map(phaseCode => {
        return {
            memory: Object.assign({}, inputIntcode),
            input: [phaseCode],
            index: 0
        }
    })
    computers[0].input.push(0);
    let computerIndex = 0;
    while (!computers[computerIndex].done) {
        let nextComputerIndex = computerIndex === 4 ? 0 : computerIndex + 1;
        intcode.runIntcode(computers[computerIndex]);
        computers[nextComputerIndex].input.push(computers[computerIndex].output);
        computerIndex = nextComputerIndex;
    }
    return computers[4].output;
}

function findMaxThrustPart1(filePath) {
    const combinations = getCombinations([0, 1, 2, 3, 4]);
    const inputIntcode = intcode.getIntcodeInput(path.join(__dirname, filePath));
    return Math.max(...combinations.map(codes => runCombinationPart1(inputIntcode, codes)));
}

function findMaxThrustPart2(filePath) {
    const combinations = getCombinations([5, 6, 7, 8, 9]);
    const inputIntcode = intcode.getIntcodeInput(path.join(__dirname, filePath));
    return Math.max(...combinations.map(codes => runCombinationPart2(inputIntcode, codes)));
}

module.exports = { findMaxThrustPart1, findMaxThrustPart2 };
