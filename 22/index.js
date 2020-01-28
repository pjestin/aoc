const path = require('path'),
    fs = require('fs');

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

// const transforms = {
//     stack: (i, d, _) => d - 1 - i,
//     cut: (i, d, n) => {
//         const N = mod(-n, d);
//         return i < N ? i + d - N : i - N;
//     },
//     // increment: (i, d, n) => mod(i * n, d),
//     increment: (i, d, n) => {
//         for (let k = 0; k <= n; ++k) {
//             if (mod(k * d + i, n) === 0) {
//                 return (k * d + i) / n;
//             }
//         }
//         return null;
//     }
// };

const transforms = {
    stack: (d) => {
        return {
            slope: -1,
            offset: d - 1,
        };
    },
    cut: (n) => {
        return {
            slope: 1,
            offset: -n,
        };
    },
    increment: (n) => {
        return {
            slope: n,
            offset: 0
        };
    },
}

const convolveTransforms = (t1, t2, d) => {
    // t2 o t1
    return {
        slope: mod(t1.slope * t2.slope, d),
        offset: mod(t2.slope * t1.offset + t2.offset, d)
        // slope: t1.slope * t2.slope,
        // offset: t2.slope * t1.offset + t2.offset
    }
}

const buildInputTransform = (instructions, d) => {
    return instructions.reduce((transform, instruction) => {
        let thisTransform = transforms[instruction.type](instruction.arg ? instruction.arg : d);
        return convolveTransforms(transform, thisTransform, d);
    },
    {
        slope: 1,
        offset: 0,
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
    return mod(repeatedTransform.slope * n + repeatedTransform.offset, d);
}

const findDiophantineSolution = (a, b) => {
    console.log([a, b])
    let rest = mod(a, b);
    if (!rest) return null
	if (rest === 1) {
		return [1, -Math.floor(a / b)];
	} else {
		let [previousX, previousY] = findDiophantineSolution(b, rest);
		return [previousY, previousX - previousY * Math.floor(a / b)];
	}
}

const findDiophantineSolutionWithOffset = (a, b, c) => {
    let [x, y] = findDiophantineSolution(a, b);
    console.log([x, y])
	return [x * c, y * c];
}

const iterateForDiophantineSolution = (a, b, c) => {
    // for (let y = 0; y <= a; ++y) {
    //     if (y % 1000000000 === 0) console.log([y, mod(c + b * y, a)])
    //     if (mod(c + b * y, a) === 0) {
    //         return (c + b * y) / a;
    //     }
    // }
    let x = 0;
    for (let k = 0; k < a; ++k) {
        if (mod(k, 1000000) === 0) console.log(k)
        x = Math.floor((c + k * b) / a) - 1;
        // console.log([c - a * x, -k * b])
        while (c - a * x >= -k * b) {
            if (mod(x, 1000000) === 0) console.log([x, mod(c - a * x, b)])
            if (mod(c - a * x, b) === 0) {
                return x;
            }
            ++x;
        }
    }
}

const findNthCard = (filePath, d, n, nRepeat) => {
    const instructions = getInputShuffle(filePath);
    const inputTransform = buildInputTransform(instructions, d);
    // console.log(inputTransform);
    const repeatedTransform = repeatTransform(inputTransform, d, nRepeat);
    // console.log(repeatedTransform);
    // console.log(`${repeatedTransform.slope} x + ${d} y = ${mod(n - repeatedTransform.offset, d)}`);
    // const diophantineSolution = findDiophantineSolutionWithOffset(repeatedTransform.slope, d, mod(n - repeatedTransform.offset, d));
    // console.log(diophantineSolution);
    // console.log(repeatedTransform.slope * diophantineSolution[0] + d * diophantineSolution[1]);
    // return diophantineSolution[0];
    return iterateForDiophantineSolution(repeatedTransform.slope, d, mod(n - repeatedTransform.offset, d));
}

module.exports = { getCardPosition, findNthCard };

// console.log(findNthCard('shuffle-input.txt', 119315717514047, 2020, 101741582076661));
// console.log(repeatTransform({slope: 4, offset: 2}, 10, 2))
console.log(iterateForDiophantineSolution(23275640837161, 119315717514047, 41334641720380))
