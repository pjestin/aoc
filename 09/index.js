const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

function paramWithModeIndex(A, paramType, targetIndex, relativeBase) {
    switch (paramType) {
        case 0:
            return A[targetIndex];
        case 1:
            return targetIndex;
        case 2:
            return relativeBase + A[targetIndex];
    }
}

function getDigit(x, i) {
    return Math.floor(x / Math.pow(10, i)) % 10;
}

function runIntcode(A, input, index, relativeBase) {
    while (A[index] % 100 !== 99) {
        const opcode = A[index] % 100;
        const firstParamIndex = paramWithModeIndex(A, getDigit(A[index], 2), index + 1, relativeBase);
        const secondParamIndex = paramWithModeIndex(A, getDigit(A[index], 3), index + 2, relativeBase);
        const thirdParamIndex = paramWithModeIndex(A, getDigit(A[index], 4), index + 3, relativeBase);
        switch (opcode) {
            case 1:
                A[thirdParamIndex] = A[firstParamIndex] + A[secondParamIndex];
                index += 4;
                break;
            case 2:
                A[thirdParamIndex] = A[firstParamIndex] * A[secondParamIndex];
                index += 4;
                break;
            case 3:
                A[firstParamIndex] = input.pop();
                index += 2;
                break;
            case 4:
                return {
                    memory: A,
                    index: index + 2,
                    relativeBase: relativeBase,
                    output: A[firstParamIndex],
                    input: input
                };
            case 5:
                index = A[firstParamIndex] !== 0 ? A[secondParamIndex] : index + 3;
                break;
            case 6:
                index = A[firstParamIndex] === 0 ? A[secondParamIndex] : index + 3;
                break;
            case 7:
                A[thirdParamIndex] = A[firstParamIndex] < A[secondParamIndex] ? 1 : 0;
                index += 4;
                break;
            case 8:
                A[thirdParamIndex] = A[firstParamIndex] === A[secondParamIndex] ? 1 : 0;
                index += 4;
                break;
            case 9:
                relativeBase += A[firstParamIndex];
                index += 2;
                break;
        }
    }
    return null;
}

function run() {
    let memory = Object.assign({}, INITIAL_INTCODE);
    let computer = {
        memory: memory,
        input: [2],
        index: 0,
        relativeBase: 0
    }
    let output = [];
    while (true) {
        let result = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (result === null) {
            break;
        } else {
            computer = result;
            output.push(computer.output);
        }
    }
    return output;
}

console.log(run())
