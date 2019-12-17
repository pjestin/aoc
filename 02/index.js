const path = require('path'),
    intcode = require('../lib/intcode'),
    EXPECTED = 19690720,
    MAX_VALUE = 100;

function correctIntcode(A, noun, verb) {
    A[1] = noun;
    A[2] = verb;
}

function getIntcodeResult(filePath, noun, verb) {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        index: 0,
    }
    correctIntcode(computer.memory, noun, verb);
    intcode.runIntcode(computer);
    return computer.memory[0];
}

function getNounVerbForExpected(filePath) {
    for (let noun = 0; noun < MAX_VALUE; noun++) {
        for (let verb = 0; verb < MAX_VALUE; verb++) {
            let result = getIntcodeResult(filePath, noun, verb);
            if (result === EXPECTED) {
                return MAX_VALUE * noun + verb;
            }
        }
    }
    return null
}

module.exports = { getIntcodeResult, getNounVerbForExpected }
