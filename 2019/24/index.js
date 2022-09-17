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

const runRecursiveIteration = (grids) => {
    let newGrids = JSON.parse(JSON.stringify(grids));
    newGrids[Math.min(...Object.keys(grids)) - 1] = getNewGrid();
    newGrids[Math.max(...Object.keys(grids)) + 1] = getNewGrid();
    const levels = Object.keys(newGrids);
    const halfColumns = Math.floor(COLUMNS / 2);
    const halfRows = Math.floor(ROWS / 2);
    levels.forEach(level => {
        let previousLevel = grids[Number(level) - 1];
        let nextLevel = grids[Number(level) + 1];
        for (let y = 0; y < ROWS; ++y) {
            for (let x = 0; x < COLUMNS; ++x) {
                if (x === halfColumns && y === halfRows) {
                    continue;
                }

                let adjacentBugs = 0;

                if (grids[level]) {
                    adjacentBugs += DIRECTIONS.reduce((nBugs, direction) => {
                        const adjacentPosition = [x + direction[0], y + direction[1]];
                        if (adjacentPosition[0] < 0 || adjacentPosition[0] >= COLUMNS
                            || adjacentPosition[1] < 0 || adjacentPosition[1] >= ROWS
                            || !grids[level][adjacentPosition[1]][adjacentPosition[0]]) {
                            return nBugs;
                        } else {
                            return nBugs + 1;
                        }
                    }, 0);
                }

                if (previousLevel) {
                    if (x === 0 && previousLevel[halfRows][halfColumns - 1]) {
                        ++adjacentBugs;
                    }
                    if (x === COLUMNS - 1 && previousLevel[halfRows][halfColumns + 1]) {
                        ++adjacentBugs;
                    }
                    if (y === 0 && previousLevel[halfRows - 1][halfColumns]) {
                        ++adjacentBugs;
                    }
                    if (y === ROWS - 1 && previousLevel[halfRows + 1][halfColumns]) {
                        ++adjacentBugs;
                    }
                }

                if (nextLevel) {
                    if (x === halfColumns - 1 && y === halfRows) {
                        for (let y = 0; y < ROWS; ++y) {
                            if (nextLevel[y][0]) {
                                ++adjacentBugs;
                            }
                        }
                    }
                    if (x === halfColumns + 1 && y === halfRows) {
                        for (let y = 0; y < ROWS; ++y) {
                            if (nextLevel[y][COLUMNS - 1]) {
                                ++adjacentBugs;
                            }
                        }
                    }
                    if (x === halfColumns && y === halfRows - 1) {
                        for (let x = 0; x < COLUMNS; ++x) {
                            if (nextLevel[0][x]) {
                                ++adjacentBugs;
                            }
                        }
                    }
                    if (x === halfColumns && y === halfRows + 1) {
                        for (let x = 0; x < COLUMNS; ++x) {
                            if (nextLevel[ROWS - 1][x]) {
                                ++adjacentBugs;
                            }
                        }
                    }
                }

                newGrids[level][y][x] = (grids[level] && grids[level][y][x] && adjacentBugs === 1)
                    || ((!grids[level] || !grids[level][y][x]) && (adjacentBugs === 1 || adjacentBugs === 2));
            }
        }
    });
    return newGrids;
}

const countBugs = (grids) => {
    return Object.values(grids).reduce((acc1, grid) => {
        return acc1 + grid.reduce((acc2, row) => {
            return acc2 + row.reduce((acc3, element) => {
                return element ? acc3 + 1 : acc3;
            }, 0);
        }, 0);
    }, 0);
}

const runRecursiveLifeGame = (filePath, nbIter) => {
    let grids = { 0: getInputGrid(filePath) };
    for (let i = 0; i < nbIter; ++i) {
        grids = runRecursiveIteration(grids);
    }
    return countBugs(grids);
}

module.exports = { runLifeGame, runRecursiveLifeGame };
