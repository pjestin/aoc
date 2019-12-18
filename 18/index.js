const path = require('path'),
    fs = require('fs'),
    DIRECTION_VECTORS = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

const getStringPosition = (position) => `${position.x};${position.y}`;

const getInputMap = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    const matrix = fs.readFileSync(absoluteFilePath, 'utf8').split('\n').map(row => row.trim().split(''));
    let walls = {};
    let state = {
        doors: {},
        keys: {},
        acquiredKeys: '',
        visited: {},
        steps: 0
    };
    matrix.forEach((row, y) => {
        row.forEach((element, x) => {
            const asciiCode = element.charCodeAt(0);
            if (element === '#') {
                walls[getStringPosition({ x, y })] = true;
            } else if (asciiCode >= 65 && asciiCode <= 90) {
                state.doors[getStringPosition({ x, y })] = element;
            } else if (asciiCode >= 97 && asciiCode <= 122) {
                state.keys[getStringPosition({ x, y })] = element;
            } else if (element === '@') {
                state.position = { x, y };
            }
        });
    });
    return [walls, state];
}

const display = (walls, state) => {
    let maxX = Math.max(...Object.keys(walls).map(wall => Number(wall.split(';')[0])));
    let maxY = Math.max(...Object.keys(walls).map(wall => Number(wall.split(';')[1])));
    let tiles = new Array(maxY + 1).fill([]);
    for (let i = 0; i < maxY + 1; ++i) {
        tiles[i] = new Array(maxX + 1).fill(' ');
    }
    Object.keys(walls).forEach(wallStringPosition => {
        const wallPosition = wallStringPosition.split(';').map(Number);
        tiles[wallPosition[1]][wallPosition[0]] = '#';
    });
    Object.keys(state.keys).forEach(keyStringPosition => {
        const keyPosition = keyStringPosition.split(';').map(Number);
        tiles[keyPosition[1]][keyPosition[0]] = state.keys[keyStringPosition];
    });
    Object.keys(state.doors).forEach(doorStringPosition => {
        const doorPosition = doorStringPosition.split(';').map(Number);
        tiles[doorPosition[1]][doorPosition[0]] = state.doors[doorStringPosition];
    });
    tiles[state.position.y][state.position.x] = '@';
    const display = tiles.map(row => row.reduce((rowDisplay, tile) => rowDisplay + tile, ''))
        .reduce((rowDisplay, curRow) => rowDisplay + curRow + '\n', '');
    console.log(display);
}

function navigateMapIterative(walls, startState) {
    let stateQueue = [startState];
    let acquiredKeyCombinations = {};
    while (stateQueue.length !== 0) {
        const state = stateQueue.shift();
        const stringPosition = getStringPosition(state.position);
        if (stringPosition in state.keys) {
            const doorStringPosition = Object.keys(state.doors)
                .reduce((doorStringPosition, curDoor) =>
                    state.doors[curDoor].toLowerCase() === state.keys[stringPosition] ? curDoor : doorStringPosition, null);
            state.acquiredKeys += state.keys[stringPosition];
            if (state.acquiredKeys in acquiredKeyCombinations) {
                continue;
            }
            delete state.doors[doorStringPosition];
            delete state.keys[stringPosition];
            state.visited = {};
            acquiredKeyCombinations[state.acquiredKeys] = true;
            console.log(`Keys left: ${Object.keys(state.keys).length}`);
            console.log(`Remaining states in queue: ${stateQueue.length}`);
            console.log(`Acquired keys: ${state.acquiredKeys}`);
            console.log(`Number of combinations: ${Object.keys(acquiredKeyCombinations).length}`)
            display(walls, state);
        }
        if (Object.keys(state.keys).length === 0) {
            return state;
        }
    
        state.visited[stringPosition] = true;
    
        DIRECTION_VECTORS.forEach(direction => {
            const nextPosition = { x: state.position.x + direction.x, y: state.position.y + direction.y };
            const nextPositionString = getStringPosition(nextPosition);
            if (nextPositionString in state.visited
                || stringPosition in walls || stringPosition in state.doors) {
                return;
            }
            let nextState = JSON.parse(JSON.stringify(state));
            nextState.position = nextPosition;
            nextState.steps++;
            stateQueue.push(nextState);
        });
    }
    return null;
}

function runNavigation(filePath) {
    let [walls, state] = getInputMap(filePath);
    return navigateMapIterative(walls, state);
}

console.log(runNavigation('input-test3.txt'));
