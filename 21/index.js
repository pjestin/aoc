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
        relativeBase: 0
    };
    computer.input.push(...getAscii('NOT A J\n'));
    computer.input.push(...getAscii('NOT B T\n'));
    computer.input.push(...getAscii('OR T J\n'));
    computer.input.push(...getAscii('NOT C T\n'));
    computer.input.push(...getAscii('OR T J\n'));
    computer.input.push(...getAscii('AND D J\n'));
    computer.input.push(...getAscii('WALK\n'));
    let outputs = [];
    while (!computer.done && !computer.needInput) {
        intcode.runIntcode(computer);
        if (computer.output > 127) {
            return computer.output;
        }
        outputs.push(String.fromCharCode(computer.output));
    }
    return outputs.reduce((acc, cur) => acc + cur, '');
}

const runSpringScript = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0
    };
    computer.input.push(...getAscii('NOT D T\n'));
    computer.input.push(...getAscii('OR B T\n'));
    computer.input.push(...getAscii('OR E T\n'));
    computer.input.push(...getAscii('NOT D J\n'));
    computer.input.push(...getAscii('OR C J\n'));
    computer.input.push(...getAscii('OR F J\n'));
    computer.input.push(...getAscii('AND T J\n'));
    computer.input.push(...getAscii('NOT J J\n'));

    computer.input.push(...getAscii('NOT A T\n'));
    computer.input.push(...getAscii('OR T J\n'));

    computer.input.push(...getAscii('OR E J\n'));

    computer.input.push(...getAscii('AND D J\n'));
    computer.input.push(...getAscii('RUN\n'));
    let outputs = [];
    while (!computer.done && !computer.needInput) {
        intcode.runIntcode(computer);
        if (computer.output > 127) {
            return computer.output;
        }
        outputs.push(String.fromCharCode(computer.output));
    }
    return outputs.reduce((acc, cur) => acc + cur, '');
}

module.exports = { walkSpringScript, runSpringScript };

console.log(runSpringScript('intcode-input.txt'))
