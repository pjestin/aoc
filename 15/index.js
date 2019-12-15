const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number),
    DIRECTION_VECTOR_MAP = { 1: { x: 0, y: -1 }, 2: { x: 0, y: 1 }, 3: { x: -1, y: 0 }, 4: { x: 1, y: 0 } };

const getStringPosition = (position) => {
    return `${position.x};${position.y}`;
}

const tryMovement = (computer, direction) => {
    computer.input.push(direction);
    computer = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
    return computer;
}

const display = (position, walls, visited) => {
    let minX = Math.min(position.x, ...Object.values(walls).map(wall => wall.x), ...Object.values(visited).map(v => v.x));
    let maxX = Math.max(position.x, ...Object.values(walls).map(wall => wall.x), ...Object.values(visited).map(v => v.x));
    let minY = Math.min(position.y, ...Object.values(walls).map(wall => wall.y), ...Object.values(visited).map(v => v.y));
    let maxY = Math.max(position.y, ...Object.values(walls).map(wall => wall.y), ...Object.values(visited).map(v => v.y));
    let tiles = new Array(maxY - minY + 1).fill([]);
    for (let i = 0; i < maxY - minY + 1; ++i) {
        tiles[i] = new Array(maxX - minX + 1).fill(' ');
    }
    Object.keys(walls).forEach(wallStringPosition => {
        tiles[walls[wallStringPosition].y - minY][walls[wallStringPosition].x - minX] = '█';
    });
    Object.keys(visited).forEach(visitedStringPosition => {
        tiles[visited[visitedStringPosition].y - minY][visited[visitedStringPosition].x - minX] = '.';
    });
    tiles[position.y - minY][position.x - minX] = 'D';
    const display = tiles.map(row => row.reduce((rowDisplay, tile) => rowDisplay + tile, ''))
        .reduce((rowDisplay, curRow) => rowDisplay + curRow + '\n', '');
    console.log(display);
}

const findOxygenSystem = (computer, position, walls, visited) => {
    let paths = [];
    for (let direction = 1; direction <= 4; ++direction) {
        const directionVector = DIRECTION_VECTOR_MAP[direction];
        const nextPosition = { x: position.x + directionVector.x, y: position.y + directionVector.y };
        const nextPositionString = getStringPosition(nextPosition);
        if (nextPositionString in walls || nextPositionString in visited) {
            continue;
        }
        let thisComputer = JSON.parse(JSON.stringify(computer));
        thisComputer = tryMovement(thisComputer, direction);
        let status = thisComputer.output;
        switch (status) {
            case 0:
                walls[nextPositionString] = nextPosition;
                break;
            case 1:
                visited[nextPositionString] = nextPosition;
                let nextPath = findOxygenSystem(thisComputer, nextPosition, walls, visited);
                if (nextPath) {
                    nextPath.push(position);
                }
                paths.push(nextPath);
                break;
            case 2:
                return [position];
        }
    }
    return paths.reduce((minPath, path) => minPath === null || (path !== null && path.length < minPath.length) ? path : minPath, null);
}

const fillOxygen = (position, walls, visited) => {
    let oxygenTimes = [];
    for (let direction = 1; direction <= 4; ++direction) {
        const directionVector = DIRECTION_VECTOR_MAP[direction];
        const nextPosition = { x: position.x + directionVector.x, y: position.y + directionVector.y };
        const nextPositionString = getStringPosition(nextPosition);
        if (nextPositionString in walls || nextPositionString in visited) {
            continue;
        }
        visited[nextPositionString] = nextPosition;
        oxygenTimes.push(1 + fillOxygen(nextPosition, walls, visited));
    }
    return oxygenTimes.length === 0 ? 0 : Math.max(...oxygenTimes);
}

const run = () => {
    let computer = {
        memory: Object.assign({}, INITIAL_INTCODE),
        input: [],
        index: 0,
        relativeBase: 0
    };
    let visited = {};
    let walls = {};
    const position = { x: 0, y: 0 };
    const path = findOxygenSystem(computer, position, walls, visited);
    const oxygenSystemPosition = path[0];
    display(position, walls, visited);
    console.log(path.length);
    visited = {};
    const oxygenTime = fillOxygen(oxygenSystemPosition, walls, visited) - 1;
    console.log(oxygenTime);
}

run();
