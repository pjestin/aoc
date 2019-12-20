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
        const portalPosition = getPositionObject(portalStringPosition);
        if (portalPosition.x === matrix[0].length - 3 || portalPosition.x === 2
            || portalPosition.y === matrix.length - 3 || portalPosition.y === 2) {
            portals[portalStringPosition].levelChange = -1;
        } else {
            portals[portalStringPosition].levelChange = 1;
        }
    });

    return [open, start, end, portals];
}

const navigateMaze = (filePath, recurse) => {
    const [open, start, end, portals] = getInputMaze(filePath);
    const endPositionString = `${getPositionString(end)};${0}`;
    const startState = { steps: 0, position: start, visited: {}, level: 0 };
    let stateQueue = [startState];
    while (stateQueue.length !== 0) {
        const state = stateQueue.shift();
        const positionString = getPositionString(state.position);
        const positionStringWithLevel = `${positionString};${state.level}`;
        if (!(positionString in open) || positionStringWithLevel in state.visited) {
            continue;
        } else if (positionStringWithLevel === endPositionString) {
            return state.steps;
        }
        state.visited[positionStringWithLevel] = true;

        if (stateQueue.length % 1000 === 0) {
            // console.log(`Queue size: ${stateQueue.length}`)
            console.log([state.position, state.level, state.steps]);
        }

        DIRECTION_VECTORS.forEach(direction => {
            const nextPosition = { x: state.position.x + direction.x, y: state.position.y + direction.y };
            let nextState = JSON.parse(JSON.stringify(state));
            nextState.position = nextPosition;
            nextState.steps++;
            stateQueue.push(nextState);
        });

        if (positionString in portals) {
            const levelChange = portals[positionString].levelChange;;
            if (!recurse || (state.level + levelChange >= 0 && state.level + levelChange <= 10)) {
                const nextPosition = portals[positionString].to;
                let nextState = JSON.parse(JSON.stringify(state));
                nextState.position = nextPosition;
                nextState.steps++;
                if (recurse) {
                    nextState.level += levelChange;
                }
                stateQueue.push(nextState);
            }
        }
    }
    throw 'No way out';
}

module.exports = { navigateMaze };
