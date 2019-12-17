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
    while (!computer.done) {
        intcode.runIntcode(computer);
    }
    return computer.output;
}

module.exports = { runBoost };
