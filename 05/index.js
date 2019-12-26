const path = require('path'),
    intcode = require('../lib/intcode');

function getDiagnosticCodePart1(filePath, systemId) {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        index: 0,
        relativeBase: 0,
        input: [systemId],
        output: []
    };
    intcode.runIntcode(computer);
    for (let i = 0; i < computer.output.length - 1; ++i) {
        if (computer.output[i] !== 0) {
            throw `Diagnostic failed, code: ${previousOutput}`;
        }
    }
    return computer.output[computer.output.length - 1];
}

function getDiagnosticCodePart2(filePath, systemId) {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        index: 0,
        relativeBase: 0,
        input: [systemId],
        output: []
    };
    intcode.runIntcode(computer);
    return computer.output[0];
}

module.exports = { getDiagnosticCodePart1, getDiagnosticCodePart2 };
