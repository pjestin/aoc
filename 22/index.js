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

const dealNewStack = (deck) => {
    return deck.reverse();
}

const cut = (deck, n) => {
    const index = n % deck.length;
    return [...deck.slice(index, deck.length), ...deck.slice(0, index)];
}

const dealWithIncrement = (deck, n) => {
    let newDeck = Array(deck.length).fill(0);
    for (let i = 0; i < deck.length; ++i) {
        let index = (i * n) % deck.length;
        newDeck[index] = deck[i];
    }
    return newDeck;
}

const shuffleDeck = (filePath, deckSize) => {
    let deck = Array(deckSize).fill().map((_, i) => i);
    const instructions = getInputShuffle(filePath);
    instructions.forEach(instruction => {
        switch (instruction.type) {
            case "cut":
                deck = cut(deck, instruction.arg);
                break;
            case "stack":
                deck = dealNewStack(deck);
                break;
            case "increment":
                deck = dealWithIncrement(deck, instruction.arg);
                break;
        }
    });
    return deck;
}

const transforms = {
    stack: (i, d, _) => d - 1 - i,
    cut: (i, d, n) => {
        const N = mod(-n, d);
        return i < N ? i + d - N : i - N;
    },
    // increment: (i, d, n) => mod(i * n, d),
    increment: (i, d, n) => {
        for (let k = 0; k <= n; ++k) {
            if (mod(k * d + i, n) === 0) {
                return (k * d + i) / n;
            }
        }
        return null;
    }
};

const findNthCard = (filePath, d, n, repeat) => {
    const instructions = getInputShuffle(filePath).reverse();
    let result = n;
    for (let i = 0; i < repeat; ++i) {
        result = instructions.reduce((result, instruction) => transforms[instruction.type](result, d, instruction.arg), result);
    }
    console.log(Object.keys(results).length);
    return result;
}

module.exports = { shuffleDeck };

// console.log(findNthCard('shuffle-input.txt', 119315717514047, 2020, 10000));
