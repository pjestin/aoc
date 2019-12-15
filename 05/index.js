const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode');

function getIntcodeInput(inputFilePath) {
    const file = path.join(__dirname, inputFilePath);
    return Object.assign({}, fs.readFileSync(file, 'utf8').trim().split(',').map(Number));
}

function getDiagnosticCodePart1(filePath, systemId) {
    let computer = {
        memory: getIntcodeInput(filePath),
        index: 0,
        relativeBase: 0,
        input: [systemId],
        output: 0
    };
    while (true) {
        let result = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
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
        memory: getIntcodeInput(filePath),
        index: 0,
        relativeBase: 0,
        input: [systemId]
    };
    computer = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
    return computer.output;
}

module.exports = { getDiagnosticCodePart1, getDiagnosticCodePart2 };
