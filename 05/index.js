const path = require('path'),
    intcode = require('../lib/intcode');

function getDiagnosticCodePart1(filePath, systemId) {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        index: 0,
        relativeBase: 0,
        input: [systemId],
        output: 0
    };
    while (true) {
        let result = intcode.runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (result !== null && computer.output !== 0) {
            throw `Diagnostic failed, code: ${computer.output}`;
        } else if (result === null) {
            break;
        }
        computer = result;
    }
    return computer.output;
}

function getDiagnosticCodePart2(filePath, systemId) {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        index: 0,
        relativeBase: 0,
        input: [systemId]
    };
    computer = intcode.runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
    return computer.output;
}

module.exports = { getDiagnosticCodePart1, getDiagnosticCodePart2 };
