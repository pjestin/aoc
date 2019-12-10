const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'asteroid-input-test.txt'),
    ASTEROID_MAP = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split('\n').map(row => row.trim().split(''));

function getAsteroidPositions() {
    let positions = [];
    ASTEROID_MAP.forEach((row, y) => {
        row.forEach((object, x) => {
            if (object === '#') {
                positions.push({ x: x, y: y });
            }
        });
    });
    return positions;
}

function getNumberOfDetectables(asteroidPositions, current) {
    let detectables = [];
    asteroidPositions.forEach(asteroid => {
        const diffX = asteroid.x - current.x;
        const diffY = asteroid.y - current.y;
        if (diffX === 0 && diffY === 0) {
            return;
        }
        let existent = false;
        detectables.forEach(detectable => {
            if (diffY * detectable.diffX === diffX * detectable.diffY
                && diffX * detectable.diffX >= 0
                && diffY * detectable.diffY >= 0) {
                existent = true;
            }
        });
        if (!existent) {
            detectables.push({ diffX, diffY });
        }
    });
    return detectables.length;
}

function getBestAsteroid(asteroidPositions) {
    const asteroidsWithSlopes = asteroidPositions.map(asteroid => {
        return {
            x: asteroid.x,
            y: asteroid.y,
            detectables: getNumberOfDetectables(asteroidPositions, asteroid)
        };
    });
    return asteroidsWithSlopes.reduce((max, cur) => cur.detectables > max.detectables ? cur : max, { detectables: 0 });
}

function getSlopes(asteroidPositions, current) {
    let slopes = {};
    let numberOfSlopes = 0;
    asteroidPositions.forEach(asteroid => {
        const diffX = asteroid.x - current.x;
        const diffY = asteroid.y - current.y;
        if (diffX === 0 && diffY === 0) {
            return;
        }
        let slope = diffX === 0
            ? diffY > 0 ? Infinity : -Infinity
            : Math.round(diffY / diffX * 10000) / 10000;
        if (!(slope in slopes)) {
            numberOfSlopes++;
            slopes[slope] = [asteroid];
        } else {
            slopes[slope].push(asteroid);
        }
    });
    console.log(numberOfSlopes);
    return slopes;
}

const asteroidPositions = getAsteroidPositions();
// console.log(getNumberOfDetectables(asteroidPositions, { x: 5, y: 8 }));
// console.log(getBestAsteroid(asteroidPositions));
const station = getBestAsteroid(asteroidPositions);
console.log(getSlopes(asteroidPositions, station));
