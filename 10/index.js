const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'asteroid-input.txt'),
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

function distance(diffX, diffY) {
    return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))
}

function getAngles(asteroidPositions, current) {
    let angles = {};
    asteroidPositions.forEach(asteroid => {
        const diffX = asteroid.x - current.x;
        const diffY = asteroid.y - current.y;
        if (diffX === 0 && diffY === 0) {
            return;
        }
        let angle = diffX === 0
            ? (diffY > 0 ? 0 : Math.PI)
            : Math.acos(-diffY / distance(diffX, diffY))
        if (diffX < 0) {
            angle = 2 * Math.PI - angle;
        }
        angle = Math.round(angle * 10000) / 10000;
        if (!(angle in angles)) {
            angles[angle] = [];
        }
        angles[angle].push(asteroid);
    });
    for (let angle in angles) {
        angles[angle].sort((a, b) => distance(b.x - current.x, b.y - current.y) - distance(a.x - current.x, a.y - current.y));
    }
    return angles;
}

function getNumberOfDetectables(asteroidPositions, current) {
    return Object.keys(getAngles(asteroidPositions, current)).length;
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

function destroyedAsteroids(stationAngles) {
    let asteroids = [];
    while (Object.keys(stationAngles).length > 0) {
        Object.keys(stationAngles).sort().forEach(angle => {
            asteroids.push(stationAngles[angle].pop());
            if (stationAngles[angle].length === 0) {
                delete stationAngles[angle];
            }
        });
    }
    return asteroids;
}

const asteroidPositions = getAsteroidPositions();
const station = getBestAsteroid(asteroidPositions);
console.log(`Station is at ${JSON.stringify(station)}`);
const stationAngles = getAngles(asteroidPositions, station);
const destroyed = destroyedAsteroids(stationAngles);
console.log(`Number of destroyed asteroids: ${destroyed.length}`);
console.log(`200th destroyed asteroid: ${JSON.stringify(destroyed[199])}`)
