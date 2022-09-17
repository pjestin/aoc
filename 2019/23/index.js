const path = require('path'),
    intcode = require('../lib/intcode');

const buildComputerArray = (filePath, nComputers) => {
    const memory = intcode.getIntcodeInput(path.join(__dirname, filePath));
    return [...Array(nComputers).keys()].map(index => {
        return {
            memory: Object.assign({}, memory),
            input: [index],
            index: 0,
            relativeBase: 0,
            output: []
        };
    });
}

const runComputers = (filePath, useNat) => {
    const nComputers = 50;
    let computers = buildComputerArray(filePath, nComputers);
    let nat = null;
    let nats = {};
    while (true) {
        let noComputerRan = true;
        for (let index = 0; index < nComputers; ++index) {
            if (computers[index].done) {
                return;
            } else if (computers[index].needInput && computers[index].input.length === 0) {
                computers[index].input.push(-1);
            } else {
                noComputerRan = false;
            }
            intcode.runIntcode(computers[index]);
            if (computers[index].output.length > 0) {
                for (let packetIndex = 0; packetIndex < computers[index].output.length / 3; ++packetIndex) {
                    const [address, x, y] = computers[index].output.slice(3 * packetIndex, 3 * packetIndex + 3);
                    if (address === 255) {
                        if (useNat) {
                            nat = [x, y];
                        } else {
                            return [x, y];
                        }
                    } else {
                        computers[address].input.push(...[x, y]);
                    }
                }
                computers[index].output = [];
            }
        }
        if (useNat && noComputerRan) {
            computers[0].input.push(...nat);
            const stringNat = JSON.stringify(nat);
            if (stringNat in nats) {
                return nat;
            }
            nats[stringNat] = true;
        }
    }
}

module.exports = { runComputers };
