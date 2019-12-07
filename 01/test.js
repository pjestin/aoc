const index = require('./index.js')

exports['test calculateFuelForModule'] = assert => {
    assert.equal(index.calculateFuelForModule(-2), 0, 'calculateFuelForModule(-2)=0');
    assert.equal(index.calculateFuelForModule(0), 0, 'calculateFuelForModule(0)=0');
    assert.equal(index.calculateFuelForModule(5), 0, 'calculateFuelForModule(5)=0');
    assert.equal(index.calculateFuelForModule(17), 3, 'calculateFuelForModule(17)=3');
    assert.equal(index.calculateFuelForModule(430), 201, 'calculateFuelForModule(430)=201');
}

exports['test readMassInputs'] = assert => {
    let massInput = index.readMassInputs();
    assert.equal(massInput.length, 100, 'input length is correct');
    assert.equal(typeof massInput[0], 'number', 'input type is correct');
}

exports['test calculateFuelRequirement'] = assert => {
    assert.equal(index.calculateFuelRequirement(), 5175499, 'integration test');
}

if (module == require.main) require('test').run(exports)
