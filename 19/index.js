const path = require('path'),
    intcode = require('../lib/intcode');

const getStringPosition = (position) => `${position.x};${position.y}`;

const getBeamPoints = (filePath, maxX, maxY) => {
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
    return beamPositions;
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

const estimateSlope = (filePath, bound, maxIter, step, roughSlope) => {
    const intcodeInput = intcode.getIntcodeInput(path.join(__dirname, filePath));
    let slope = roughSlope;
    let position = { x: 0, y: 0 };
    for (let i = 0; i < maxIter; ++i) {
        position.x += step;
        position.y += Math.floor(step * slope);
        let startInBeam = isPositionInBeam(intcodeInput, position);
        // console.log(startInBeam);
        while (true) {
            if (isPositionInBeam(intcodeInput, position) !== startInBeam) {
                slope = position.y / position.x;
                break;
            } else if (bound === 'up' ^ !startInBeam) {
                position.y--;
            } else {
                position.x--;
            }
            // console.log(position)
        }
    }
    return slope;
}

const getClosestSquarePosition = (filePath) => {
    const intcodeInput = intcode.getIntcodeInput(path.join(__dirname, 'intcode-input.txt'));
    let position = { x: 10, y: 13 };
    while (!isPositionInBeam(intcodeInput, { x: position.x - 99, y: position.y + 99 })) {
        while (!isPositionInBeam(intcodeInput, position)) {
            position.y++;
            console.log(position);
        }
        position.x++;
    }
    return { x: position.x - 99, y: position.y };
}

// const beamPoints = getBeamPoints('intcode-input.txt', 100, 100);
// console.log(Object.keys(beamPoints).length);
// const upSlope = estimateSlope('intcode-input.txt', 'up', 1000, 1000, 1.3);
// const downslope = estimateSlope('intcode-input.txt', 'down', 1000, 1000, 1.3)
// console.log([upSlope, downslope]);
const intcodeInput = intcode.getIntcodeInput(path.join(__dirname, 'intcode-input.txt'));
console.log(isPositionInBeam(intcodeInput, { x: 832, y: 1172 }))
// console.log(getClosestSquarePosition(intcodeInput))
