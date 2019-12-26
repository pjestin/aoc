const path = require('path'),
    intcode = require('../lib/intcode');

const getAscii = (stringToConvert) => {
    return stringToConvert.split('').map((_, index) => stringToConvert.charCodeAt(index));
}

const walkSpringScript = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0,
        output: []
    };
    computer.input.push(...getAscii('NOT A J\n'));
    computer.input.push(...getAscii('NOT B T\n'));
    computer.input.push(...getAscii('OR T J\n'));
    computer.input.push(...getAscii('NOT C T\n'));
    computer.input.push(...getAscii('OR T J\n'));
    computer.input.push(...getAscii('AND D J\n'));
    computer.input.push(...getAscii('WALK\n'));
    intcode.runIntcode(computer);
    const nonAscii = computer.output.find(output => output > 127);
    if (nonAscii) {
        return nonAscii;
    }
    return computer.output
        .map(code => String.fromCharCode(code))
        .reduce((acc, cur) => acc + cur, '');
}

const runSpringScript = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0,
        output: []
    };

    computer.input.push(...getAscii('NOT D J\n'));
    computer.input.push(...getAscii('OR E J\n'));
    computer.input.push(...getAscii('OR H J\n'));

    computer.input.push(...getAscii('NOT A T\n'));
    computer.input.push(...getAscii('AND T J\n'));

    computer.input.push(...getAscii('AND D J\n'));

    computer.input.push(...getAscii('RUN\n'));

    intcode.runIntcode(computer);
    const nonAscii = computer.output.find(output => output > 127);
    if (nonAscii) {
        return nonAscii;
    }
    return computer.output
        .map(code => String.fromCharCode(code))
        .reduce((acc, cur) => acc + cur, '');
}

module.exports = { walkSpringScript, runSpringScript };

// console.log(runSpringScript('intcode-input.txt'))
