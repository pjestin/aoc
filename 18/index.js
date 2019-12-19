const path = require('path'),
    fs = require('fs'),
    DIRECTION_VECTORS = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];

const getStringPosition = (position) => `${position.x};${position.y}`;

const getObjectPosition = (stringPosition) => {
    const positionArray = stringPosition.split(';').map(Number);
    return { x: positionArray[0], y: positionArray[1] };
}

const getInputMap = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    const matrix = fs.readFileSync(absoluteFilePath, 'utf8').split('\n').map(row => row.trim().split(''));
    let walls = {};
    let keys = {};
    let doors = {};
    let startPosition = {};
    matrix.forEach((row, y) => {
        row.forEach((element, x) => {
            const asciiCode = element.charCodeAt(0);
            if (element === '#') {
                walls[getStringPosition({ x, y })] = true;
            } else if (asciiCode >= 65 && asciiCode <= 90) {
                doors[getStringPosition({ x, y })] = element;
            } else if (asciiCode >= 97 && asciiCode <= 122) {
                keys[getStringPosition({ x, y })] = element;
            } else if (element === '@') {
                startPosition = { x, y };
            }
        });
    });
    return [walls, keys, doors, startPosition];
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

// function navigateMapIterative(walls, startState) {
//     let stateQueue = [startState];
//     let cachedKeyCombinations = {};
//     while (stateQueue.length !== 0) {
//         const state = stateQueue.shift();
//         const stringPosition = getStringPosition(state.position);
//         if (stringPosition in state.keys) {
//             const doorStringPosition = Object.keys(state.doors)
//                 .reduce((doorStringPosition, curDoor) =>
//                     state.doors[curDoor].toLowerCase() === state.keys[stringPosition] ? curDoor : doorStringPosition, null);
//             state.acquiredKeys.sort();
//             state.acquiredKeys.push(state.keys[stringPosition]);
//             if (state.acquiredKeys.reduce((acc, cur) => acc + cur, '') in cachedKeyCombinations) {
//                 continue;
//             }
//             delete state.doors[doorStringPosition];
//             delete state.keys[stringPosition];
//             state.visited = {};
//             cachedKeyCombinations[state.acquiredKeys] = true;
//             // console.log(`Keys left: ${Object.keys(state.keys).length}`);
//             // console.log(`Remaining states in queue: ${stateQueue.length}`);
//             // console.log(`Acquired keys: ${state.acquiredKeys}`);
//             // console.log(`Number of combinations: ${Object.keys(cachedKeyCombinations).length}`)
//             // display(walls, state);
//         }
//         if (Object.keys(state.keys).length === 0) {
//             return state;
//         }

//         state.visited[stringPosition] = true;

//         DIRECTION_VECTORS.forEach(direction => {
//             const nextPosition = { x: state.position.x + direction.x, y: state.position.y + direction.y };
//             const nextPositionString = getStringPosition(nextPosition);
//             if (nextPositionString in state.visited
//                 || nextPositionString in walls || nextPositionString in state.doors) {
//                 return;
//             }
//             let nextState = JSON.parse(JSON.stringify(state));
//             nextState.position = nextPosition;
//             nextState.steps++;
//             stateQueue.push(nextState);
//         });
//     }
//     return null;
// }

function findKey(walls, keys, doors, startState, keyToFind) {
    let stateQueue = [startState];
    while (stateQueue.length !== 0) {
        const state = stateQueue.shift();
        const stringPosition = getStringPosition(state.position);
        if (stringPosition in keys && keys[stringPosition] === keyToFind) {
            return state;
        } else if (stringPosition in doors) {
            if (doors[stringPosition].toLowerCase() === keyToFind) {
                continue;
            } else {
                state.keysNeeded.push(doors[stringPosition].toLowerCase());
            }
        }

        state.visited[stringPosition] = true;

        DIRECTION_VECTORS.forEach(direction => {
            const nextPosition = { x: state.position.x + direction.x, y: state.position.y + direction.y };
            const nextPositionString = getStringPosition(nextPosition);
            if (nextPositionString in state.visited || nextPositionString in walls) {
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

const buildGraph = (walls, keys, doors, startPosition) => {
    let edges = { '@': [] };
    Object.keys(keys).forEach(key => {
        edges[keys[key]] = [];
        Object.keys(keys).forEach(otherKey => {
            if (otherKey === key) {
                return;
            }
            const keyPosition = getObjectPosition(key);
            let state = { position: keyPosition, steps: 0, visited: {}, keysNeeded: [] };
            const otherKeyState = findKey(walls, keys, doors, state, keys[otherKey]);
            if (otherKeyState) {
                edges[keys[key]].push({
                    end: keys[otherKey],
                    steps: otherKeyState.steps,
                    keysNeeded: otherKeyState.keysNeeded
                });
            }
        });
        let state = { position: startPosition, steps: 0, visited: {}, keysNeeded: [] };
        const keyState = findKey(walls, keys, doors, state, keys[key]);
        edges['@'].push({
            end: keys[key],
            steps: keyState.steps,
            keysNeeded: keyState.keysNeeded
        });
    });
    return edges;
}

const navigateGraph = (edges, nKeys) => {
    const startState = {
        key: '@',
        steps: 0,
        acquired: [],
    }
    let stateQueue = [startState];
    while (stateQueue.length !== 0) {
        let state = stateQueue.shift();
        if (state.acquired.includes(state.key)) {
            continue;
        }
        // console.log(state.key)
        state.acquired.push(state.key);
        // console.log(state.acquired);
        if (state.acquired.length === nKeys + 1) {
            return state;
        }

        let newStates = [];
        edges[state.key].forEach(edge => {
            if (!edge.keysNeeded.reduce((canGo, keyNeeded) => canGo && state.acquired.includes(keyNeeded), true)) {
                return;
            } else {
                // console.log(`Going on edge: ${JSON.stringify(edge)}`);
                let nextState = JSON.parse(JSON.stringify(state));
                nextState.steps += edge.steps;
                nextState.key = edge.end;
                newStates.push(nextState);
            }
        });
        stateQueue.push(...newStates.sort((state, otherState) => state.steps - otherState.steps));
    }
    return null;
}

function runNavigation(filePath) {
    let [walls, keys, doors, startPosition] = getInputMap(filePath);
    // let state = { keys, doors, position: startPosition, steps: 0, visited: {} };
    // return navigateMapIterative(walls, state);
    let state = { position: startPosition, steps: 0, visited: {}, keysNeeded: [] };
    // console.log(findKey(walls, keys, doors, state, 'f'))
    const edges = buildGraph(walls, keys, doors, startPosition);
    // console.log(edges)
    return navigateGraph(edges, Object.keys(keys).length);
}

console.log(runNavigation('input-test4.txt'));
