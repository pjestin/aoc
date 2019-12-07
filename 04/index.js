const MIN = 125730,
    MAX = 579381;

function getPossibilities() {
    let possibilities = 0;
    for (let i = MIN; i <= MAX; ++i) {
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
        if (increasing && count.includes(2)) {
            ++possibilities;
        }
    }
    return possibilities;
}

console.log(getPossibilities())
