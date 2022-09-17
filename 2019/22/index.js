const path = require('path'),
    fs = require('fs'),
    BigInteger = require('biginteger').BigInteger;

function mod(n, m) {
    return ((n % m) + m) % m;
}

const getInputShuffle = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    const cutRegex = /cut (-?\d*)/;
    const stackRegex = /deal into new stack/;
    const incrementRegex = /deal with increment (-?\d*)/;
    return fs.readFileSync(absoluteFilePath, 'utf8').split('\n').map(instruction => {
        const cutMatches = cutRegex.exec(instruction);
        const stackMatches = stackRegex.exec(instruction);
        const incrementMatches = incrementRegex.exec(instruction);
        if (cutMatches) {
            return { type: "cut", arg: Number(cutMatches[1]) };
        } else if (stackMatches) {
            return { type: "stack" };
        } else if (incrementMatches) {
            return { type: "increment", arg: Number(incrementMatches[1]) };
        }
    });
}

const transforms = {
    stack: () => {
        return {
            slope: BigInteger(-1),
            offset: BigInteger(-1),
        };
    },
    cut: (n) => {
        return {
            slope: BigInteger(1),
            offset: BigInteger(-n),
        };
    },
    increment: (n) => {
        return {
            slope: BigInteger(n),
            offset: BigInteger(0)
        };
    },
}

const convolveTransforms = (t1, t2, d) => {
    // t2 o t1
    return {
        slope: t1.slope.multiply(t2.slope).remainder(d),
        offset: t2.slope.multiply(t1.offset).add(t2.offset).remainder(d),
    }
}

const buildInputTransform = (instructions, d) => {
    return instructions.reduce((transform, instruction) => {
        let thisTransform = transforms[instruction.type](instruction.arg);
        return convolveTransforms(transform, thisTransform, d);
    },
        {
            slope: BigInteger(1),
            offset: BigInteger(0),
        });
}

const repeatTransform = (transform, d, nRepeat) => {
    if (nRepeat === 1) {
        return transform;
    } else if (nRepeat % 2 === 0) {
        let halfTransform = repeatTransform(transform, d, nRepeat / 2);
        return convolveTransforms(halfTransform, halfTransform, d);
    } else {
        let nextTransform = repeatTransform(transform, d, nRepeat - 1);
        return convolveTransforms(nextTransform, transform, d);
    }
}

const getCardPosition = (filePath, d, n, nRepeat) => {
    const instructions = getInputShuffle(filePath);
    const inputTransform = buildInputTransform(instructions, d);
    const repeatedTransform = repeatTransform(inputTransform, d, nRepeat);
    return mod(repeatedTransform.slope.multiply(n).add(repeatedTransform.offset).remainder(d).valueOf(), d);
}

const findDiophantineSolution = (a, b) => {
    let rest = mod(a, b);
    if (!rest) return null
    if (rest === 1) {
        return [1, -Math.floor(a / b)];
    } else {
        let [previousX, previousY] = findDiophantineSolution(b, rest);
        return [previousY, previousX - previousY * Math.floor(a / b)];
    }
}

const findNthCard = (filePath, d, n, nRepeat) => {
    const instructions = getInputShuffle(filePath);
    const inputTransform = buildInputTransform(instructions, d);
    const repeatedTransform = repeatTransform(inputTransform, d, nRepeat);
    const diophantineSolution = findDiophantineSolution(repeatedTransform.slope, d);
    const c = n - repeatedTransform.offset;
    return mod(BigInteger(diophantineSolution[0]).multiply(c).remainder(d).valueOf(), d);
}

module.exports = { getCardPosition, findNthCard };
