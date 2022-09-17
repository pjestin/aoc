const path = require('path'),
    intcode = require('../lib/intcode');

const initTiles = (tileArray) => {
    const xLen = tileArray.reduce((acc, cur, i) => i % 3 === 0 ? Math.max(acc, cur) : acc, 0) + 1;
    const yLen = tileArray.reduce((acc, cur, i) => i % 3 === 1 ? Math.max(acc, cur) : acc, 0) + 1;
    let tiles = new Array(yLen).fill([]);
    for (let i = 0; i < yLen; ++i) {
        tiles[i] = new Array(xLen).fill(0);
    }
    return tiles;
}

const updateGameData = (gameData, tileArray) => {
    if (!gameData.tiles) {
        gameData.tiles = initTiles(tileArray);
    }
    for (let i = 0; i < tileArray.length; i += 3) {
        if (tileArray[i] === -1) {
            gameData.score = tileArray[i + 2];
            continue;
        }
        gameData.tiles[tileArray[i + 1]][tileArray[i]] = tileArray[i + 2];
    }
}

const countBlockTiles = (tiles) => {
    return tiles.reduce((accRow, curRow) => accRow +
        curRow.reduce((acc, cur) => cur === 2 ? acc + 1 : acc, 0), 0);
}

const getUpdatedTiles = (computer) => {
    intcode.runIntcode(computer);
    const tiles = computer.output;
    computer.output = [];
    return tiles;
}

const countBlockTilesFromFile = (filePath) => {
    let gameData = {};
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0,
        output: []
    };
    const tiles = getUpdatedTiles(computer);
    updateGameData(gameData, tiles);
    return countBlockTiles(gameData.tiles);
}

const getJoystickInput = (tiles) => {
    let ballX = 0;
    let paddleX = 0;
    for (let y = 0; y < tiles.length; ++y) {
        for (let x = 0; x < tiles[0].length; ++x) {
            if (tiles[y][x] === 3) {
                paddleX = x;
            } else if (tiles[y][x] === 4) {
                ballX = x;
            }
        }
    }
    if (ballX < paddleX) {
        return -1;
    } else if (ballX > paddleX) {
        return 1;
    } else {
        return 0;
    }
}

const playGame = (filePath) => {
    let computer = {
        memory: intcode.getIntcodeInput(path.join(__dirname, filePath)),
        input: [],
        index: 0,
        relativeBase: 0,
        output: []
    };
    computer.memory[0] = 2;
    let gameData = {};
    while (true) {
        const tiles = getUpdatedTiles(computer);
        if (computer.done) {
            updateGameData(gameData, tiles);
            return gameData.score;
        }
        updateGameData(gameData, tiles);
        computer.input.push(getJoystickInput(gameData.tiles));
    }
}

module.exports = { countBlockTilesFromFile, playGame };
