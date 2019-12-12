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

function updateVelocities(positions, velocities) {
    positions.forEach((position, moonIndex) => {
        positions.forEach(otherPosition => {
            for (let i = 0; i < 3; ++i) {
                if (position[i] < otherPosition[i]) {
                    velocities[moonIndex][i]++;
                } else if (position[i] > otherPosition[i]) {
                    velocities[moonIndex][i]--;
                }
            }
        });
    });
}

function updatePositions(positions, velocities) {
    velocities.forEach((velocity, moonIndex) => {
        for (let i = 0; i < 3; ++i) {
            positions[moonIndex][i] += velocity[i];
        }
    });
}

function runStep(positions, velocities) {
    updateVelocities(positions, velocities);
    updatePositions(positions, velocities);
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
    const stringifiedInitialPositions = JSON.stringify(INITIAL_POSITIONS);
    const stringifiedInitialVelocities = JSON.stringify(INITIAL_VELOCITIES);
    let positions = JSON.parse(stringifiedInitialPositions);
    let velocities = JSON.parse(stringifiedInitialVelocities);
    let steps = 1;
    runStep(positions, velocities);
    while (positions)
        while ([0, 1, 2, 3].some(index => !arrayEq(positions[index], INITIAL_POSITIONS[index])
            || !arrayEq(velocities[index], INITIAL_VELOCITIES[index]))) {
            runStep(positions, velocities);
            ++steps;
        }
    return steps;
}

console.log(run());
