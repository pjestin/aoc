const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

function runIntcode(A, input, i) {
    while (i < A.length && A[i] % 100 !== 99) {
        const opcode = A[i] % 100;
        if (opcode === 3) {
            A[A[i + 1]] = input.pop();
            i += 2;
        } else if (opcode === 4) {
            return {
                memory: A,
                index: i + 2,
                output: A[A[i + 1]],
                input: input
            };
        } else {
            const firstParam = A[i] % 1000 - opcode === 0 ? A[A[i + 1]] : A[i + 1];
            const secondParam = A[i] % 10000 - A[i] % 1000 === 0 ? A[A[i + 2]] : A[i + 2];
            if (opcode === 1 || opcode === 2 || opcode === 7 || opcode === 8) {
                let result;
                switch (opcode) {
                    case 1:
                        result = firstParam + secondParam;
                        break;
                    case 2:
                        result = firstParam * secondParam;
                        break;
                    case 7:
                        result = firstParam < secondParam ? 1 : 0;
                        break;
                    case 8:
                        result = firstParam === secondParam ? 1 : 0;
                        break;
                }
                A[A[i + 3]] = result;
                i += 4;
            } else if (opcode === 5 || opcode === 6) {
                if (firstParam !== 0 ^ opcode === 6) {
                    i = secondParam;
                } else {
                    i += 3;
                }
            }
        }
    }
    return null;
}

function runCombination(phaseCodes) {
    let computers = phaseCodes.map(phaseCode => {
        return {
            memory: Array.from(INITIAL_INTCODE),
            input: [phaseCode],
            index: 0
        }
    })
    computers[0].input.splice(0, 0, 0);
    let computerIndex = 0;
    while (true) {
        let computer = computers[computerIndex];
        let nextComputerIndex = computerIndex === 4 ? 0 : computerIndex + 1;
        computers[computerIndex] = runIntcode(computer.memory, computer.input, computer.index);
        if (computers[computerIndex] === null) {
            return computers[4].output;
        }
        computers[nextComputerIndex].input.splice(0, 0, computers[computerIndex].output);
        computerIndex = nextComputerIndex;
    }
}

function getCombinations(codes) {
    if (codes.length === 1) {
        return [[codes[0]]];
    }
    const code = codes.pop();
    let combinations = [];
    const combinationsWithout = getCombinations(codes);
    combinationsWithout.forEach(combinationWithout => {
        for (let i = 0; i <= combinationWithout.length; ++i) {
            let combinationWith = Array.from(combinationWithout);
            combinationWith.splice(i, 0, code);
            combinations.push(combinationWith);
        }
    });
    return combinations;
}

function findMaxThrust() {
    const combinations = getCombinations([5, 6, 7, 8, 9]);
    return Math.max(...combinations.map(runCombination));
}

console.log(findMaxThrust());
