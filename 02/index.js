const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.json'),
    INITIAL_INTCODE = JSON.parse(fs.readFileSync(INPUT_FILE_PATH, 'utf8')),
    EXPECTED = 19690720,
    MAX_VALUE = 100;

function correctIntcode(A, noun, verb) {
    A[1] = noun;
    A[2] = verb;
}

function runIntcode(A) {
    let i = 0;
    while (i < A.length && A[i] !== 99) {
        if (A[i] == 1) {
            A[A[i + 3]] = A[A[i + 1]] + A[A[i + 2]];
        } else if (A[i] == 2) {
            A[A[i + 3]] = A[A[i + 1]] * A[A[i + 2]];
        }
        i += 4;
    }
}

function getIntcodeResult(noun, verb) {
    let A = Array.from(INITIAL_INTCODE);
    correctIntcode(A, noun, verb);
    runIntcode(A);
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
console.log(`Result: ${result}`)