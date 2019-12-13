const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

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

const displayGame = (gameData) => {
    const charMap = {
        0: ' ',
        1: '█',
        2: '░',
        3: '—',
        4: 'o'
    }
    const gameDisplay = gameData.tiles.map(row => row.reduce((rowDisplay, tile) => rowDisplay + charMap[tile], ''))
        .reduce((display, curRow) => display + curRow + '\n', '');
    console.log(gameDisplay);
    console.log(`Score: ${gameData.score}`);
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

const playGame = () => {
    let computers = [{
        memory: Object.assign({}, INITIAL_INTCODE),
        input: [],
        index: 0,
        relativeBase: 0
    }];
    computers[0].memory[0] = 2;
    let blockCount = 1;
    let gameData = {};
    while (blockCount !== 0) {
        let tiles = [];
        let currentComputer = JSON.parse(JSON.stringify(computers[computers.length - 1]));
        while (true) {
            currentComputer = runIntcode(currentComputer.memory, currentComputer.input, currentComputer.index, currentComputer.relativeBase);
            if (currentComputer === null) {
                updateGameData(gameData, tiles);
                if (countBlockTiles(gameData.tiles) === 0) {
                    console.log(`You won! Score: ${gameData.score}`);
                } else {
                    console.log(`You lost! Score: ${gameData.score}`);
                }
                return;
            } else if (currentComputer.needInput) {
                break;
            }
            tiles.push(currentComputer.output);
        }
        updateGameData(gameData, tiles);
        displayGame(gameData);
        blockCount = countBlockTiles(gameData.tiles);
        const input = getJoystickInput(gameData.tiles);
        currentComputer.input.push(input);
        computers.push(currentComputer);
    }
}

playGame();
