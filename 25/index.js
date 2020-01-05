const path = require('path'),
    readline = require('readline-sync'),
    intcode = require('../lib/intcode');

const toAscii = (stringToConvert) => {
    return stringToConvert.split('').map((_, index) => stringToConvert.charCodeAt(index));
}

const fromAscii = (asciiArray) => {
    return asciiArray.reduce((acc, cur) => acc + String.fromCharCode(cur), '');
}

const runDroidProgram = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0,
        output: []
    };
    while (!computer.done) {
        intcode.runIntcode(computer);
        const nonAscii = computer.output.find(output => output > 127);
        if (nonAscii) {
            return nonAscii;
        }
        console.log(fromAscii(computer.output));
        computer.output = [];
        if (computer.needInput) {
            const command = readline.question() + '\n';
            // console.log(command);
            computer.input = toAscii(command);
        }
    }
}

runDroidProgram('intcode-input.txt');
