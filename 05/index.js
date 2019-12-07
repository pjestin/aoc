const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.json'),
    INITIAL_INTCODE = JSON.parse(fs.readFileSync(INPUT_FILE_PATH, 'utf8'));

function runIntcode(A, input) {
    let i = 0;
    while (i < A.length && A[i] % 100 !== 99) {
        let opcode = A[i] % 100;
        if (opcode === 3) {
            A[A[i + 1]] = input;
            i += 2;
        } else if (opcode === 4) {
            console.log(A[A[i + 1]]);
            i += 2;
        } else {
            let firstParam = A[i] % 1000 - opcode === 0 ? A[A[i + 1]] : A[i + 1];
            let secondParam = A[i] % 10000 - A[i] % 1000 === 0 ? A[A[i + 2]] : A[i + 2];
            if (opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8) {
                let result;
                switch (opcode) {
                    case 1:
                        result = firstParam + secondParam;
                        break;
                    case 2:
                        result = firstParam * secondParam;
                        break;
                    case 7:
                        result = firstParam < secondParam ? 1 : 0;
                        break;
                    case 8:
                        result = firstParam === secondParam ? 1 : 0;
                        break;
                }
                A[A[i + 3]] = result;
                i += 4;
            } else if (opcode === 5 || opcode === 6) {
                if (firstParam !== 0 ^ opcode === 6) {
                    i = secondParam;
                } else {
                    i += 3;
                }
            }
        }
    }
}

runIntcode(INITIAL_INTCODE, 5);
