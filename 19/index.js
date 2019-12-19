const path = require('path'),
    intcode = require('../lib/intcode');

const getStringPosition = (position) => `${position.x};${position.y}`;

const getNumberOfBeamPoints = (filePath, maxX, maxY) => {
    let beamPositions = {};
    const intcodeInput = intcode.getIntcodeInput(path.join(__dirname, filePath));
    for (let x = 0; x < maxX; ++x) {
        for (let y = 0; y < maxY; ++y) {
            let computer = {
                memory: Object.assign({}, intcodeInput),
                input: [x, y],
                index: 0,
                relativeBase: 0
            };
            intcode.runIntcode(computer);
            if (computer.needInput) {
                throw 'Something wrong with computer';
            } else if (computer.done) {
                throw 'Computer stopped!'
            } else if (computer.output === 1) {
                beamPositions[getStringPosition({ x, y })] = { x, y };
            }
        }
    }
    return Object.keys(beamPositions).length;
}

const isPositionInBeam = (intcodeInput, position) => {
    let computer = {
        memory: Object.assign({}, intcodeInput),
        input: [position.x, position.y],
        index: 0,
        relativeBase: 0
    };
    intcode.runIntcode(computer);
    return computer.output === 1;
}

const getClosestSquarePosition = (filePath) => {
    const intcodeInput = intcode.getIntcodeInput(path.join(__dirname, filePath));
    let position = { x: 0, y: 0 };
    while (!isPositionInBeam(intcodeInput, { x: position.x, y: position.y + 99 }) || !isPositionInBeam(intcodeInput, { x: position.x + 99, y: position.y })) {
        while (!isPositionInBeam(intcodeInput, { x: position.x, y: position.y + 99 })) {
            position.x++;
        }
        while (!isPositionInBeam(intcodeInput, { x: position.x + 99, y: position.y })) {
            position.y++;
        }
    }
    return 10000 * position.x + position.y;
}

module.exports = { getNumberOfBeamPoints, getClosestSquarePosition }
