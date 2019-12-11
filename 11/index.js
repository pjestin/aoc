const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.txt'),
    INITIAL_INTCODE = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split(',').map(Number);

function paintPanels() {
    let position = { x: 0, y: 0 };
    let direction = { x: 0, y: -1 };
    let paintedPanels = { '{"x":0,"y":0}': 1 };
    let computer = {
        memory: Object.assign({}, INITIAL_INTCODE),
        input: [],
        index: 0,
        relativeBase: 0
    }
    while (true) {
        const stringPosition = JSON.stringify(position);
        computer.input.push(stringPosition in paintedPanels ? paintedPanels[stringPosition] : 0);
        let colorResult = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
        if (colorResult === null) {
            break;
        } else {
            computer = colorResult;
            paintedPanels[stringPosition] = computer.output;
            let directionResult = runIntcode(computer.memory, computer.input, computer.index, computer.relativeBase);
            if (directionResult === null) {
                break;
            } else {
                computer = directionResult;
                direction = computer.output === 1
                    ? { x: -direction.y, y: direction.x }
                    : { x: direction.y, y: -direction.x };
                position = { x: position.x + direction.x, y: position.y + direction.y };
            }
        }
    }
    return paintedPanels;
}

function getPanelDisplay(paintedPanels) {
    const panelPositions = Object.keys(paintedPanels).map(JSON.parse);
    const panelXs = panelPositions.map(position => position.x);
    const panelYs = panelPositions.map(position => position.y);
    const minX = Math.min(...panelXs);
    const maxX = Math.max(...panelXs);
    const minY = Math.min(...panelYs);
    const maxY = Math.max(...panelYs);
    let panels = new Array(maxY - minY + 1).fill([]);
    for (let i = 0; i < panels.length; ++i) {
        panels[i] = new Array(maxX - minX + 1).fill(0);
    }

    Object.keys(paintedPanels).forEach(stringPosition => {
        const position = JSON.parse(stringPosition);
        panels[-minY + position.y][-minX + position.x] = paintedPanels[stringPosition];
    });

    return panels;
}

function displayPanels(panelDisplay) {
    console.log(panelDisplay.map(row =>
        row.map(panel => panel === 1 ? '█' : '░')
            .reduce((acc, cur) => acc + cur, '')
    )
        .reduce((acc, cur) => acc + cur + '\n', ''));
}

const paintedPanels = paintPanels();
console.log(Object.keys(paintedPanels).length);
const panelDisplay = getPanelDisplay(paintedPanels);
displayPanels(panelDisplay);
