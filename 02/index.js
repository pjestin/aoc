const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.json'),
    INITIAL_INTCODE = JSON.parse(fs.readFileSync(INPUT_FILE_PATH, 'utf8')),
    EXPECTED = 19690720,
    MAX_VALUE = 100;

function correctIntcode(A, noun, verb) {
    A[1] = noun;
    A[2] = verb;
}

function getIntcodeResult(noun, verb) {
    let A = Object.assign({}, INITIAL_INTCODE);
    correctIntcode(A, noun, verb);
    runIntcode(A, [], 0, 0);
    return A[0];
}

function getNounVerbForExpected(expected) {
    for (let noun = 0; noun < MAX_VALUE; noun++) {
        for (let verb = 0; verb < MAX_VALUE; verb++) {
            let result = getIntcodeResult(noun, verb);
            if (result === expected) {
                return MAX_VALUE * noun + verb;
            }
        }
    }
    return null
}

console.time('getNounVerbForExpected');
let result = getNounVerbForExpected(EXPECTED);
console.timeEnd('getNounVerbForExpected');
console.log(`Result: ${result}`);
