const path = require('path'),
    fs = require('fs');

const getInputSignal = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    return fs.readFileSync(absoluteFilePath, 'utf8').trim().split('').map(Number);
}

const getNextPhase = (signal) => {
    let sum = 0;
    let signalCumul = signal.map(x => {
        sum += x;
        return sum;
    });
    signalCumul.unshift(0);
    let resultPhase = [];
    for (let digit = 0; digit < signal.length; ++digit) {
        let result = 0;
        for (let index = 0; index <= Math.floor((signal.length - 1) / ((digit + 1) * 4)); ++index) {
            result += signalCumul[Math.min(4 * (digit + 1) * index + 2 * digit + 1, signalCumul.length - 1)]
                - signalCumul[Math.min(4 * (digit + 1) * index + digit, signalCumul.length - 1)];
            result -= signalCumul[Math.min(4 * (digit + 1) * index + 4 * digit + 3, signalCumul.length - 1)]
                - signalCumul[Math.min(4 * (digit + 1) * index + 3 * digit + 2, signalCumul.length - 1)];
        }
        resultPhase.push(Math.abs(result) % 10);
    }
    return resultPhase;
}

const arrayToNumber = (array) => {
    return Number(array.reduce((acc, cur) => acc + cur.toString(), ''));
}

const repeat = (signal, nRepeat) => {
    let result = [];
    for (let i = 0; i < nRepeat; ++i) {
        result.push(...signal);
    }
    return result;
}

const applyFft = (filePath, phases, nRepeat, offset) => {
    let signal = getInputSignal(filePath);
    const skipDigits = offset ? arrayToNumber(signal.slice(0, 7)) : 0;
    signal = repeat(signal, nRepeat);
    for (let i = 0; i < phases; ++i) {
        signal = getNextPhase(signal);
    }
    return arrayToNumber(signal.slice(skipDigits, skipDigits + 8));
}

module.exports = { applyFft };
