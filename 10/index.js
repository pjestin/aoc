const fs = require('fs'),
    path = require('path');

function getAsteroidPositions(filePath) {
    const absoluteFilePath = path.join(__dirname, filePath);
    const asteroidMap = fs.readFileSync(absoluteFilePath, 'utf8').trim().split('\n').map(row => row.trim().split(''));
    let positions = [];
    asteroidMap.forEach((row, y) => {
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

function getBestAsteroid(filePath) {
    const asteroidPositions = getAsteroidPositions(filePath);
    const asteroidsWithSlopes = asteroidPositions.map(asteroid => {
        return {
            x: asteroid.x,
            y: asteroid.y,
            detectables: getNumberOfDetectables(asteroidPositions, asteroid)
        };
    });
    return asteroidsWithSlopes.reduce((max, cur) => cur.detectables > max.detectables ? cur : max, { detectables: 0 });
}

function destroyedAsteroid200(filePath) {
    const asteroidPositions = getAsteroidPositions(filePath);
    const station = getBestAsteroid(filePath);
    const stationAngles = getAngles(asteroidPositions, station);
    let asteroids = [];
    while (Object.keys(stationAngles).length > 0) {
        Object.keys(stationAngles).sort().forEach(angle => {
            asteroids.push(stationAngles[angle].pop());
            if (stationAngles[angle].length === 0) {
                delete stationAngles[angle];
            }
        });
    }
    const asteroid = asteroids[199];
    return 100 * asteroid.x + asteroid.y;
}

module.exports = { getBestAsteroid, destroyedAsteroid200 }
