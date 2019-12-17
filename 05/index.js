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
    let previousOutput = 0;
    while (!computer.done) {
        if (previousOutput !== 0) {
            throw `Diagnostic failed, code: ${computer.output}`;
        }
        previousOutput = computer.output;
        intcode.runIntcode(computer);
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
    intcode.runIntcode(computer);
    return computer.output;
}

module.exports = { getDiagnosticCodePart1, getDiagnosticCodePart2 };
