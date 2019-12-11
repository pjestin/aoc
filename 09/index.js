const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

function run() {
    let memory = Object.assign({}, INITIAL_INTCODE);
    let computer = {
        memory: memory,
        input: [2],
        index: 0,
        relativeBase: 0
    }
    let output = [];
    while (true) {
        let result = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (result === null) {
            break;
        } else {
            computer = result;
            output.push(computer.output);
        }
    }
    return output;
}

console.log(run())
