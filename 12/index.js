const INITIAL_POSITIONS = [
    [12, 0, -15],
    [-8, -5, -10],
    [7, -17, 1],
    [2, -11, -6]
],
    INITIAL_VELOCITIES = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

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

function getTotalEnergyAfterSteps(steps) {
    const stringifiedInitialPositions = JSON.stringify(INITIAL_POSITIONS);
    const stringifiedInitialVelocities = JSON.stringify(INITIAL_VELOCITIES);
    let positions = JSON.parse(stringifiedInitialPositions);
    let velocities = JSON.parse(stringifiedInitialVelocities);
    for (let steps = 0; steps < 1000; ++steps) {
        runStep(positions, velocities);
    }
    return getTotalEnergy(positions, velocities);
}

function arrayEq(A, B) {
    for (let i = 0; i < 3; ++i) {
        if (A[i] !== B[i]) return false;
    }
    return true;
}

function run() {
    let positions = JSON.parse(JSON.stringify(INITIAL_POSITIONS));
    let velocities = JSON.parse(JSON.stringify(INITIAL_VELOCITIES));
    let steps = 1;
    runStep(positions, velocities);
    while (true) {
        let stop = true;
        for (let index = 0; index < 4; ++index) {
            if (!arrayEq(positions[index], INITIAL_POSITIONS[index])
                || !arrayEq(velocities[index], INITIAL_VELOCITIES[index])) {
                stop = false;
                break;
            }
        }
        if (stop) break;
        runStep(positions, velocities);
        ++steps;
        if (steps % 1000000 === 0) console.log(steps);
    }
    return steps;
}

// console.log(getTotalEnergyAfterSteps(1000))
console.log(run());
