const path = require('path'),
    fs = require('fs'),
    ROWS = 5,
    COLUMNS = 5,
    DIRECTIONS = [[0, 1], [0, -1], [1, 0], [-1, 0]];

const getInputGrid = (filePath) => {
    const absoluteFilePath = path.join(__dirname, filePath);
    return fs.readFileSync(absoluteFilePath, 'utf8').split('\n').map(row =>
        row.trim().split('').map(element => element === '#')
    );
}

const getNewGrid = () => {
    let grid = new Array(ROWS).fill([]);
    for (let row = 0; row < ROWS; ++row) {
        grid[row] = new Array(COLUMNS).fill(false);
    }
    return grid;
}

const getBiodiversityRating = (grid) => {
    let rating = 0;
    let factor = 1;
    for (let y = 0; y < ROWS; ++y) {
        for (let x = 0; x < COLUMNS; ++x) {
            if (grid[y][x]) {
                rating += factor;
            }
            factor *= 2;
        }
    }
    return rating;
}

const runInteration = (grid) => {
    let newGrid = getNewGrid();
    for (let y = 0; y < ROWS; ++y) {
        for (let x = 0; x < COLUMNS; ++x) {
            let adjacentBugs = DIRECTIONS.reduce((nBugs, direction) => {
                const adjacentPosition = [x + direction[0], y + direction[1]];
                if (adjacentPosition[0] < 0 || adjacentPosition[0] >= COLUMNS
                    || adjacentPosition[1] < 0 || adjacentPosition[1] >= ROWS
                    || !grid[adjacentPosition[1]][adjacentPosition[0]]) {
                    return nBugs;
                } else {
                    return nBugs + 1;
                }
            }, 0);
            newGrid[y][x] = (grid[y][x] && adjacentBugs === 1)
                || (!grid[y][x] && (adjacentBugs === 1 || adjacentBugs === 2));
        }
    }
    return newGrid;
}

const runLifeGame = (filePath) => {
    let grid = getInputGrid(filePath);
    let biodiversityRatings = {};
    while (true) {
        const biodiversityRating = getBiodiversityRating(grid);
        if (biodiversityRating in biodiversityRatings) {
            return biodiversityRating;
        }
        biodiversityRatings[biodiversityRating] = true;
        grid = runInteration(grid);
    }
}

module.exports = { runLifeGame };
