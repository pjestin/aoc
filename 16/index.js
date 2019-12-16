const path = require('path'),
    fs = require('fs'),
    PATTERN = [0, 1, 0, -1];

const getInputSignal = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    return fs.readFileSync(absoluteFilePath, 'utf8').trim().split('').map(Number);
}

const getPatternForDigit = (digit) => {
    let pattern = [];
    PATTERN.forEach(element => {
        for (let i = 1; i <= digit + 1; ++i) {
            pattern.push(element);
        }
    })
    return pattern;
}

const getNextPhase = (input) => {
    return input.map((_, digit) => {
        const pattern = getPatternForDigit(digit);
        let result = 0;
        let patternIndex = 1;
        for (let index = 0; index < input.length; ++index) {
            result += input[index] * pattern[patternIndex];
            ++patternIndex;
            if (patternIndex >= pattern.length) {
                patternIndex = 0;
            }
        }
        return Math.abs(result) % 10;
    });
}

const getEightDigits = (signal, digitsToSkip) => {
    return Number(signal.slice(digitsToSkip, digitsToSkip + 8).reduce((acc, cur) => acc + cur.toString(), ''));
}

const applyFft = (filePath, phases) => {
    let signal = getInputSignal(filePath);
    for (let i = 0; i < phases; ++i) {
        signal = getNextPhase(signal);
    }
    return getEightDigits(signal, 0);
}

module.exports = { applyFft };
