const path = require('path'),
    fs = require('fs'),
    DIRECTION_VECTORS = [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 0, y: -1 }],
    RIGHT_DOWN = [{ x: 1, y: 0 }, { x: 0, y: 1 }];

const getPositionString = (position) => `${position.x};${position.y}`;

const getPositionObject = (positionString) => {
    const positionArray = positionString.split(';').map(Number);
    return { x: positionArray[0], y: positionArray[1] };
}

const getInputMaze = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    const matrix = fs.readFileSync(absoluteFilePath, 'utf8').split('\n').map(row => row.split(''));
    let open = {};
    let start;
    let end;
    let portals = {};

    matrix.forEach((row, y) => {
        row.forEach((element, x) => {
            const charCode = element.charCodeAt(0);
            if (element === '.') {
                open[getPositionString({ x, y })] = true;
            } else if (charCode >= 65 && charCode <= 90) {
                const otherLetterInfo = RIGHT_DOWN.reduce((otherLetter, direction) => {
                    const otherPosition = { x: x + direction.x, y: y + direction.y };
                    if (otherPosition.x >= matrix[0].length || otherPosition.y >= matrix.length) {
                        return otherLetter;
                    }
                    const otherElement = matrix[otherPosition.y][otherPosition.x];
                    if (otherElement) {
                        const otherCharCode = otherElement.charCodeAt(0);
                        return otherCharCode >= 65 && otherCharCode <= 90
                            ? { letter: otherElement, position: otherPosition }
                            : otherLetter;
                    } else {
                        return otherLetter;
                    }
                }, null);
                if (otherLetterInfo) {
                    let portalPosition = {};
                    if (x === otherLetterInfo.position.x) {
                        portalPosition = y > 0 && matrix[y - 1][x] === '.' ? { x, y: y - 1 } : { x, y: y + 2 };
                    } else {
                        portalPosition = x > 0 && matrix[y][x - 1] === '.' ? { x: x - 1, y } : { x: x + 2, y };
                    }
                    const portalName = element + otherLetterInfo.letter;
                    if (portalName === 'AA') {
                        start = portalPosition;
                    } else if (portalName === 'ZZ') {
                        end = portalPosition;
                    } else {
                        portals[getPositionString(portalPosition)] = { name: portalName };
                    }
                }
            }
        });
    });

    Object.keys(portals).forEach(portalStringPosition => {
        Object.keys(portals).forEach(otherPortalStringPosition => {
            if (otherPortalStringPosition !== portalStringPosition
                && portals[otherPortalStringPosition].name === portals[portalStringPosition].name) {
                portals[portalStringPosition].to = getPositionObject(otherPortalStringPosition);
            }
        });
    });

    return [open, start, end, portals];
}

const navigateMaze = (filePath) => {
    const [open, start, end, portals] = getInputMaze(filePath);
    const endPositionString = getPositionString(end);
    const startState = { steps: 0, position: start, visited: {} };
    let stateQueue = [startState];
    while (stateQueue.length !== 0) {
        const state = stateQueue.shift();
        const positionString = getPositionString(state.position);
        if (!(positionString in open) || positionString in state.visited) {
            continue;
        } else if (positionString === endPositionString) {
            return state.steps;
        }
        state.visited[positionString] = true;

        DIRECTION_VECTORS.forEach(direction => {
            const nextPosition = { x: state.position.x + direction.x, y: state.position.y + direction.y };
            let nextState = JSON.parse(JSON.stringify(state));
            nextState.position = nextPosition;
            nextState.steps++;
            stateQueue.push(nextState);
        });

        if (positionString in portals) {
            const nextPosition = portals[positionString].to;
            let nextState = JSON.parse(JSON.stringify(state));
            nextState.position = nextPosition;
            nextState.steps++;
            stateQueue.push(nextState);
        }
    }
    throw 'No way out';
}

module.exports = { navigateMaze };
