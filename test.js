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

if (module == require.main) require('test').run(exports)
