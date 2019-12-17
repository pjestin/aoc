const path = require('path'),
    intcode = require('../lib/intcode');

const getCameraOutput = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0
    };
    let outputs = [];
    while (true) {
        computer = intcode.runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (computer === null) {
            break;
        }
        outputs.push(String.fromCharCode(computer.output));
    }
    return outputs.reduce((acc, cur) => acc + cur, '');
}

const getStringPosition = (position) => {
    return `${position.x};${position.y}`;
}

const findIntersections = (cameraOutput) => {
    let scaffoldPositions = {};
    cameraOutput.split('\n').forEach((row, y) => {
        row.split('').forEach((character, x) => {
            if (character === '#') {
                const position = { x, y };
                scaffoldPositions[getStringPosition(position)] = position;
            }
        });
    });
    let scaffoldIntersections = {};
    Object.keys(scaffoldPositions).forEach(stringPosition => {
        let crossingScaffolds = 0;
        const position = scaffoldPositions[stringPosition];
        if (getStringPosition({ x: position.x - 1, y: position.y }) in scaffoldPositions) {
            crossingScaffolds++;
        }
        if (getStringPosition({ x: position.x + 1, y: position.y }) in scaffoldPositions) {
            crossingScaffolds++;
        }
        if (getStringPosition({ x: position.x, y: position.y - 1 }) in scaffoldPositions) {
            crossingScaffolds++;
        }
        if (getStringPosition({ x: position.x, y: position.y + 1 }) in scaffoldPositions) {
            crossingScaffolds++;
        }
        if (crossingScaffolds >= 3) {
            scaffoldIntersections[stringPosition] = position;
        }
    });
    return scaffoldIntersections;
}

const getSumOfAlignmentParameters = (filePath) => {
    const cameraOutput = getCameraOutput(filePath);
    const scaffoldIntersections = findIntersections(cameraOutput);
    return Object.keys(scaffoldIntersections).reduce((acc, cur) => {
        const intersection = scaffoldIntersections[cur];
        return acc + intersection.x * intersection.y;
    }, 0);
}

const getAscii = (stringToConvert) => {
    return stringToConvert.split('').map((_, index) => stringToConvert.charCodeAt(index));
}

const runWithMovement = (filePath) => {
    let input = getAscii('A,B,B,A,C,A,A,C,B,C\n');
    input.push(...getAscii('R,8,L,12,R,8\n'));
    input.push(...getAscii('R,12,L,8,R,10\n'));
    input.push(...getAscii('R,8,L,8,L,8,R,8,R,10\n'));
    input.push(...getAscii('y\n'));

    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: input,
        index: 0,
        relativeBase: 0
    };
    computer.memory[0] = 2;
    let outputs = [];
    while (true) {
        computer = intcode.runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (computer === null) {
            console.log('Computer stopped');
            break;
        } else if (computer.output) {
            if (computer.output > 127) {
                return computer.output
            }
        } else {
            console.log('No output');
            break;
        }
    }
    return outputs.reduce((acc, cur) => acc + cur, '');;
}

module.exports = { getSumOfAlignmentParameters };

// console.log(getCameraOutput('intcode-input.txt'))
runWithMovement('intcode-input.txt')
