const path = require('path'),
    intcode = require('../lib/intcode'),
    EXPECTED = 19690720,
    MAX_VALUE = 100;

function correctIntcode(A, noun, verb) {
    A[1] = noun;
    A[2] = verb;
}

function getIntcodeResult(filePath, noun, verb) {
    let A = intcode.getIntcodeInput(path.join(__dirname, filePath));
    correctIntcode(A, noun, verb);
    intcode.runIntcode(A, [], 0, 0);
    return A[0];
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
