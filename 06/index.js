const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'orbit-input.txt');

function buildOrbitMap() {
    let orbitArray = fs.readFileSync(INPUT_FILE_PATH, 'utf8')
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

function getNumberOfOrbits(orbitMap) {
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

function getMinOrbitalShifts(orbitMap, source, target) {
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

let orbitMap = buildOrbitMap();
console.log(getNumberOfOrbits(orbitMap));
console.log(getMinOrbitalShifts(orbitMap, 'YOU', 'SAN'));
