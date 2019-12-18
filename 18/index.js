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

// const sleep = (ms) => {
//     return new Promise(resolve => setTimeout(resolve, ms));
// }

function navigateMap(walls, state, previousState) {
    // display(walls, state);
    // await sleep(100);
    const stringPosition = getStringPosition(state.position);
    if (stringPosition in walls || stringPosition in state.doors) {
        return null;
    } else if (stringPosition in state.keys) {
        const doorStringPosition = Object.keys(state.doors)
            .reduce((doorStringPosition, curDoor) =>
                state.doors[curDoor].toLowerCase() === state.keys[stringPosition] ? curDoor : doorStringPosition, null);
        delete state.doors[doorStringPosition];
        delete state.keys[stringPosition];
        previousState = null;
    }
    if (Object.keys(state.keys).length === 0) {
        state.finished = true;
        return state;
    }

    let nextStates = DIRECTION_VECTORS.map(direction => {
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.position = { x: state.position.x + direction.x, y: state.position.y + direction.y };
        nextState.steps++;
        if (previousState && nextState.position.x === previousState.position.x
            && nextState.position.y === previousState.position.y) {
            return null;
        } else {
            return navigateMap(walls, nextState, state);
        }
    });

    const bestState = nextStates.reduce((bestNextState, nextState) => {
        if (!nextState) {
            return bestNextState;
        } else if (!bestNextState
            || nextState.finished
            || Object.keys(nextState.doors).length < Object.keys(bestNextState.doors).length
            || (Object.keys(nextState.doors).length === Object.keys(bestNextState.doors).length
                && Object.keys(nextState.keys).length > Object.keys(bestNextState.keys).length)
            || (Object.keys(nextState.doors).length === Object.keys(bestNextState.doors).length
                && Object.keys(nextState.keys).length === Object.keys(bestNextState.keys).length
                && nextState.steps < bestNextState.steps)) {
            return nextState;
        } else {
            return bestNextState;
        }
    }, null);
    return bestState;
}

function runNavigation(filePath) {
    let [walls, state] = getInputMap(filePath);
    return navigateMap(walls, state);
}

// const map = getInputMap('input-test.txt');
// console.log(map);

console.log(runNavigation('input-test.txt'));
