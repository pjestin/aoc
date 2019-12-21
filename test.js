exports['test 01'] = assert => {
    const index = require('./01/index.js');
    assert.equal(index.calculateFuelRequirementPart1(), 3452245, 'part 1');
    assert.equal(index.calculateFuelRequirementPart2(), 5175499, 'part 2');
}

exports['test 02'] = assert => {
    const index = require('./02/index.js');
    assert.equal(index.getIntcodeResult('input-intcode-test.txt', 9, 10), 3500, 'part 1 test');
    assert.equal(index.getIntcodeResult('input-intcode.txt', 12, 2), 3516593, 'part 1');
    assert.equal(index.getNounVerbForExpected('input-intcode.txt'), 7749, 'part 2');
}

exports['test 03'] = assert => {
    const index = require('./03/index.js');
    assert.equal(index.getNearestPointManhattan('wires-input-test1.txt'), 159, 'part 1 test 1');
    assert.equal(index.getNearestPointManhattan('wires-input-test2.txt'), 135, 'part 1 test 2');
    assert.equal(index.getNearestPointManhattan('wires-input.txt'), 403, 'part 1');
    assert.equal(index.getNearestPointSteps('wires-input-test1.txt'), 610, 'part 2 test 1');
    assert.equal(index.getNearestPointSteps('wires-input-test2.txt'), 410, 'part 2 test 2');
    assert.equal(index.getNearestPointSteps('wires-input.txt'), 4158, 'part 2');
}

exports['test 04'] = assert => {
    const index = require('./04/index.js');
    assert.equal(index.getPossibilitiesPart1(125730, 579381), 2081, 'part 1');
    assert.equal(index.getPossibilitiesPart2(125730, 579381), 1411, 'part 2');
}

exports['test 05'] = assert => {
    const index = require('./05/index.js');
    assert.equal(index.getDiagnosticCodePart1('intcode-input.txt', 1), 12896948, 'part 1');
    assert.equal(index.getDiagnosticCodePart2('intcode-input-test.txt', 5), 999, 'part 2 test 1');
    assert.equal(index.getDiagnosticCodePart2('intcode-input-test.txt', 8), 1000, 'part 2 test 2');
    assert.equal(index.getDiagnosticCodePart2('intcode-input-test.txt', 13), 1001, 'part 2 test 3');
    assert.equal(index.getDiagnosticCodePart2('intcode-input.txt', 5), 7704130, 'part 2');
}

exports['test 06'] = assert => {
    const index = require('./06/index.js');
    assert.equal(index.getNumberOfOrbits('orbit-input-test.txt'), 54, 'part 1 test');
    assert.equal(index.getNumberOfOrbits('orbit-input.txt'), 270768, 'part 1');
    assert.equal(index.getMinOrbitalShifts('orbit-input-test.txt', 'YOU', 'SAN'), 4, 'part 2 test');
    assert.equal(index.getMinOrbitalShifts('orbit-input.txt', 'YOU', 'SAN'), 451, 'part 2');
}

exports['test 07'] = assert => {
    const index = require('./07/index.js');
    assert.equal(index.findMaxThrustPart1('intcode-input-test.txt'), 20, 'part 1 test');
    assert.equal(index.findMaxThrustPart1('intcode-input.txt'), 18812, 'part 1');
    assert.equal(index.findMaxThrustPart2('intcode-input-test.txt'), 18216, 'part 2 test');
    assert.equal(index.findMaxThrustPart2('intcode-input.txt'), 25534964, 'part 2');
}

exports['test 08'] = assert => {
    const index = require('./08/index.js');
    assert.equal(index.get1And2In0MinLayer('image-input-test.txt', 2, 2), 4, 'part 1 test');
    assert.equal(index.get1And2In0MinLayer('image-input.txt', 6, 25), 2250, 'part 1');
    assert.equal(index.getImageDisplay('image-input-test.txt', 2, 2), `
░█
█░
`, 'part 2 test');
    assert.equal(index.getImageDisplay('image-input.txt', 6, 25), `
████░█░░█░░░██░█░░█░█░░░░
█░░░░█░░█░░░░█░█░░█░█░░░░
███░░████░░░░█░█░░█░█░░░░
█░░░░█░░█░░░░█░█░░█░█░░░░
█░░░░█░░█░█░░█░█░░█░█░░░░
█░░░░█░░█░░██░░░██░░████░
`, 'part 2');
}

exports['test 09'] = assert => {
    const index = require('./09/index.js');
    assert.equal(index.runBoost('intcode-input-test.txt', 1), 1219070632396864, 'part 1 test');
    assert.equal(index.runBoost('intcode-input.txt', 1), 3507134798, 'part 1');
    assert.equal(index.runBoost('intcode-input-test.txt', 2), 1219070632396864, 'part 2 test');
    assert.equal(index.runBoost('intcode-input.txt', 2), 84513, 'part 2');
}

exports['test 10'] = assert => {
    const index = require('./10/index.js');
    assert.equal(index.getBestAsteroid('asteroid-input-test.txt').detectables, 210, 'part 1 test');
    assert.equal(index.getBestAsteroid('asteroid-input.txt').detectables, 314, 'part 1');
    assert.equal(index.destroyedAsteroid200('asteroid-input-test.txt'), 802, 'part 2 test');
    assert.equal(index.destroyedAsteroid200('asteroid-input.txt'), 1513, 'part 2');
}

exports['test 11'] = assert => {
    const index = require('./11/index.js');
    assert.equal(Object.keys(index.paintPanels('intcode-input.txt', false)).length, 2539, 'part 1');
    assert.equal(index.getPanelDisplay('intcode-input.txt'), `
░████░█░░░░████░███░░█░░█░░░██░███░░░██░░░░
░░░░█░█░░░░█░░░░█░░█░█░█░░░░░█░█░░█░█░░█░░░
░░░█░░█░░░░███░░███░░██░░░░░░█░█░░█░█░░█░░░
░░█░░░█░░░░█░░░░█░░█░█░█░░░░░█░███░░████░░░
░█░░░░█░░░░█░░░░█░░█░█░█░░█░░█░█░█░░█░░█░░░
░████░████░████░███░░█░░█░░██░░█░░█░█░░█░░░
`, 'part 2');
}

exports['test 12'] = assert => {
    const index = require('./12/index.js');
    assert.equal(index.getTotalEnergyAfterSteps('positions-input-test.txt', 1000), 183, 'part 1 test');
    assert.equal(index.getTotalEnergyAfterSteps('positions-input.txt', 1000), 7636, 'part 1');
    assert.equal(index.findCycle('positions-input-test.txt'), 2772, 'part 2 test');
    assert.equal(index.findCycle('positions-input.txt'), 281691380235984, 'part 2');
}

exports['test 13'] = assert => {
    const index = require('./13/index.js');
    assert.equal(index.countBlockTilesFromFile('intcode-input.txt'), 344, 'part 1');
    assert.equal(index.playGame('intcode-input.txt'), 17336, 'part 2');
}

exports['test 14'] = assert => {
    const index = require('./14/index.js');
    assert.equal(index.findOreRequirement('input-test.txt', { 'FUEL': 1 }), 2210736, 'part 1 test');
    assert.equal(index.findOreRequirement('input.txt', { 'FUEL': 1 }), 399063, 'part 1');
    assert.equal(index.findMaxFuel('input-test.txt', Math.pow(10, 12)), 460664, 'part 2 test');
    assert.equal(index.findMaxFuel('input.txt', Math.pow(10, 12)), 4215654, 'part 2');
}

exports['test 15'] = assert => {
    const index = require('./15/index.js');
    assert.equal(index.findOxygenSystem('intcode-input.txt'), 222, 'part 1');
    assert.equal(index.findOxygenTime('intcode-input.txt'), 394, 'part 2');
}

exports['test 16'] = assert => {
    const index = require('./16/index.js');
    assert.equal(index.applyFft('input-test1.txt', 100, 1, false), 24176176, 'part 1 test');
    assert.equal(index.applyFft('input.txt', 100, 1, false), 34694616, 'part 1');
    assert.equal(index.applyFft('input-test2.txt', 100, 10000, true), 84462026, 'part 2 test');
}

exports['test 17'] = assert => {
    const index = require('./17/index');
    assert.equal(index.getSumOfAlignmentParameters('intcode-input.txt'), 4408, 'part 1');
    assert.equal(index.runWithMovement('intcode-input.txt'), 862452, 'part 2');
}

exports['test 18'] = assert => {
    const index = require('./18/index');
    assert.equal(index.runNavigation('input-test1.txt'), 6, 'part 1 test 1');
    assert.equal(index.runNavigation('input-test2.txt'), 86, 'part 1 test 2');
    assert.equal(index.runNavigation('input-test3.txt'), 81, 'part 1 test 3');
    assert.equal(index.runNavigation('input-test4.txt'), 136, 'part 1 test 4');
}

exports['test 19'] = assert => {
    const index = require('./19/index');
    assert.equal(index.getNumberOfBeamPoints('intcode-input.txt', 50, 50), 192, 'part 1');
    assert.equal(index.getClosestSquarePosition('intcode-input.txt'), 8381082, 'part 2');
}

exports['test 20'] = assert => {
    const index = require('./20/index');
    assert.equal(index.navigateMaze('maze-input-test1.txt', false), 23, 'part 1 test 1');
    assert.equal(index.navigateMaze('maze-input-test2.txt', false), 58, 'part 1 test 2');
    assert.equal(index.navigateMaze('maze-input-test3.txt', false), 77, 'part 1 test 3');
    assert.equal(index.navigateMaze('maze-input.txt', false), 692, 'part 1');
    assert.equal(index.navigateMaze('maze-input-test1.txt', true), 26, 'part 2 test 1');
    assert.equal(index.navigateMaze('maze-input-test3.txt', true), 396, 'part 2 test 3');
    assert.equal(index.navigateMaze('maze-input.txt', true), 8314, 'part 2');
}

exports['test 21'] = assert => {
    const index = require('./21/index');
    assert.equal(index.runSpringScript('intcode-input.txt'), 19357544, 'part 1');
}

if (module == require.main) require('test').run(exports)
