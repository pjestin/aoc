function getPossibilities(min, max, countCheck) {
    let possibilities = 0;
    for (let i = min; i <= max; ++i) {
        stringI = i.toString();
        let previousDigit = 0;
        let increasing = true;
        let count = new Array(10).fill(0);
        stringI.split('').map(Number).forEach(digit => {
            if (digit < previousDigit) {
                increasing = false;
            }
            previousDigit = digit;
            count[digit]++;
        });
        if (increasing && countCheck(count)) {
            ++possibilities;
        }
    }
    return possibilities;
}

function getPossibilitiesPart1(min, max) {
    return getPossibilities(min, max, count => Math.max(...count) > 1);
}

function getPossibilitiesPart2(min, max) {
    return getPossibilities(min, max, count => count.includes(2));
}

module.exports = { getPossibilitiesPart1, getPossibilitiesPart2 };
