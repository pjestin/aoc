const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'orbit-input.txt');

function buildOrbitMap() {
    let orbitArray = fs.readFileSync(INPUT_FILE_PATH, 'utf8')
        .split('\n')
        .map(orbit => orbit.trim().split(')'));
    let orbits = {};
    orbitArray.forEach(orbit => {
        if (!(orbit[0] in orbits)) {
            orbits[orbit[0]] = [];
        }
        orbits[orbit[0]].push(orbit[1]);
    });
    return orbits;
}

function navigateOrbitMap(orbitMap, object) {
    if (!(object in orbitMap)) {
        return 0;
    } else {
        let number = 0;
        orbitMap[object].forEach(orbittingObject => {
            number += 1 + navigateOrbitMap(orbitMap, orbittingObject);
        })
        return number;
    }
}

function getNumberOfOrbits(orbitMap) {
    return Object.keys(orbitMap)
        .map(object => navigateOrbitMap(orbitMap, object))
        .reduce((acc, curr) => acc + curr);
}

function getPath(orbitMap, current, target) {
    if (!(current in orbitMap)) {
        return null;
    }
    else if (orbitMap[current].includes(target)) {
        return [target, current];
    } else {
        let path = null;
        orbitMap[current].forEach(orbittingObject => {
            let thisPath = getPath(orbitMap, orbittingObject, target);
            if (!thisPath) {
                return;
            } else {
                path = thisPath;
            }
        })
        if (path) {
            path.push(current);
        }
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
