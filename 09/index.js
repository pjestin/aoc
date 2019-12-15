const path = require('path'),
    intcode = require('../lib/intcode');

function runBoost(filePath, input) {
    let memory = intcode.getIntcodeInput(path.join(__dirname, filePath));
    let computer = {
        memory: memory,
        input: [input],
        index: 0,
        relativeBase: 0
    }
    let output = [];
    while (true) {
        let result = intcode.runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (result === null) {
            break;
        } else {
            computer = result;
            output.push(computer.output);
        }
    }
    return output[0];
}

module.exports = { runBoost };
