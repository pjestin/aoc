const fs = require('fs'),
    path = require('path');

function getInitialPositions(filePath) {
    const absoluteFilePath = path.join(__dirname, filePath);
    return fs.readFileSync(absoluteFilePath, 'utf8')
        .trim()
        .split('\n')
        .map(row => {
            const rowString = row.trim().split('<')[1].split('>')[0];
            return rowString.split(',').map(coordinate => Number(coordinate.trim().split('=')[1]))
        });
}

function getInitialVelocities() {
    return new Array(4).fill(new Array(3).fill(0));
}

function runStep(positions, velocities) {
    positions.forEach((position, moonIndex) => {
        positions.forEach(otherPosition => {
            [0, 1, 2].forEach(i => {
                if (position[i] < otherPosition[i]) {
                    velocities[moonIndex][i]++;
                } else if (position[i] > otherPosition[i]) {
                    velocities[moonIndex][i]--;
                }
            });
        });
    });
    velocities.forEach((velocity, moonIndex) => {
        [0, 1, 2].forEach(i => {
            positions[moonIndex][i] += velocity[i];
        });
    });
}

function getTotalEnergy(positions, velocities) {
    let total = 0;
    positions.forEach((position, moonIndex) => {
        const pot = position.reduce((acc, cur) => acc + Math.abs(cur), 0);
        const kin = velocities[moonIndex].reduce((acc, cur) => acc + Math.abs(cur), 0);
        total += pot * kin;
    });
    return total;
}

function getTotalEnergyAfterSteps(filePath, steps) {
    let positions = JSON.parse(JSON.stringify(getInitialPositions(filePath)));
    let velocities = JSON.parse(JSON.stringify(getInitialVelocities()));
    for (let i = 0; i < steps; ++i) {
        runStep(positions, velocities);
    }
    return getTotalEnergy(positions, velocities);
}

function findCycleOnDim(initialPositions, initialVelocities, dim) {
    let positions = JSON.parse(JSON.stringify(initialPositions));
    let velocities = JSON.parse(JSON.stringify(initialVelocities));
    let steps = 1;
    runStep(positions, velocities);
    while (true) {
        let stop = true;
        for (let index = 0; index < 4; ++index) {
            if (positions[index][dim] !== initialPositions[index][dim]
                || velocities[index][dim] !== initialVelocities[index][dim]) {
                stop = false;
                break;
            }
        }
        if (stop) break;
        runStep(positions, velocities);
        ++steps;
    }
    return steps;
}

function gcd(a, b) {
    if (a < b) {
        return gcd(b, a);
    }
    while (b !== 0) {
        let temp = a % b;
        a = b;
        b = temp;
    }
    return a;
}

function lcm(a, b) {
    return a * b / gcd(a, b);
}

function findCycle(filePath) {
    const initialPositions = getInitialPositions(filePath);
    const initialVelocities = getInitialVelocities(filePath);
    const cycleX = findCycleOnDim(initialPositions, initialVelocities, 0);
    const cycleY = findCycleOnDim(initialPositions, initialVelocities, 1);
    const cycleZ = findCycleOnDim(initialPositions, initialVelocities, 2);
    return lcm(cycleX, lcm(cycleY, cycleZ));
}

module.exports = { getTotalEnergyAfterSteps, findCycle };
