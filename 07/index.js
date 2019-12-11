const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

function runCombination(phaseCodes) {
    let computers = phaseCodes.map(phaseCode => {
        return {
            memory: Object.assign({}, INITIAL_INTCODE),
            input: [phaseCode],
            index: 0
        }
    })
    computers[0].input.splice(0, 0, 0);
    let computerIndex = 0;
    while (true) {
        let computer = computers[computerIndex];
        let nextComputerIndex = computerIndex === 4 ? 0 : computerIndex + 1;
        computers[computerIndex] = runIntcode(computer.memory, computer.input, computer.index);
        if (computers[computerIndex] === null) {
            return computers[4].output;
        }
        computers[nextComputerIndex].input.splice(0, 0, computers[computerIndex].output);
        computerIndex = nextComputerIndex;
    }
}

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

function findMaxThrust() {
    const combinations = getCombinations([5, 6, 7, 8, 9]);
    return Math.max(...combinations.map(runCombination));
}

console.log(findMaxThrust());
