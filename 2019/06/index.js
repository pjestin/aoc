const fs = require('fs'),
    path = require('path');

function buildOrbitMap(filePath) {
    const absoluteFilePath = path.join(__dirname, filePath);
    let orbitArray = fs.readFileSync(absoluteFilePath, 'utf8')
        .split('\n')
        .map(orbit => orbit.trim().split(')'));
    let orbits = {};
    orbitArray.forEach(orbit => {
        orbits[orbit[1]] = orbit[0];
    });
    return orbits;
}

function navigateOrbitMap(orbitMap, object) {
    return object in orbitMap ? 1 + navigateOrbitMap(orbitMap, orbitMap[object]) : 0;
}

function getNumberOfOrbits(filePath) {
    let orbitMap = buildOrbitMap(filePath);
    return Object.keys(orbitMap)
        .map(object => navigateOrbitMap(orbitMap, object))
        .reduce((acc, curr) => acc + curr);
}

function getPath(orbitMap, target, current) {
    if (current === target) {
        return [target];
    } else if (!(current in orbitMap)) {
        return null;
    } else {
        let path = getPath(orbitMap, target, orbitMap[current]);
        path.push(current);
        return path;
    }
}

function getMinOrbitalShifts(filePath, source, target) {
    let orbitMap = buildOrbitMap(filePath);
    let sourcePath = getPath(orbitMap, 'COM', source);
    let targetPath = getPath(orbitMap, 'COM', target);
    let distance = 0;
    sourcePath.forEach(step => {
        if (!targetPath.includes(step)) {
            ++distance;
        }
    });
    targetPath.forEach(step => {
        if (!sourcePath.includes(step)) {
            ++distance;
        }
    });
    return distance - 2;
}

module.exports = { getNumberOfOrbits, getMinOrbitalShifts };
