const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    EXPECTED = 19690720,
    MAX_VALUE = 100;

function getIntcodeInput(inputFilePath) {
    const file = path.join(__dirname, inputFilePath);
    return Object.assign({}, fs.readFileSync(file, 'utf8').trim().split(',').map(Number));
}

function correctIntcode(A, noun, verb) {
    A[1] = noun;
    A[2] = verb;
}

function getIntcodeResult(inputFilePath, noun, verb) {
    let A = Object.assign({}, getIntcodeInput(inputFilePath));
    correctIntcode(A, noun, verb);
    runIntcode(A, [], 0, 0);
    return A[0];
}

function getNounVerbForExpected(inputFilePath) {
    for (let noun = 0; noun < MAX_VALUE; noun++) {
        for (let verb = 0; verb < MAX_VALUE; verb++) {
            let result = getIntcodeResult(inputFilePath, noun, verb);
            if (result === EXPECTED) {
                return MAX_VALUE * noun + verb;
            }
        }
    }
    return null
}

module.exports = { getIntcodeResult, getNounVerbForExpected }
