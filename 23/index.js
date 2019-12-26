const path = require('path'),
    intcode = require('../lib/intcode');

const runComputers = (filePath) => {
    const nComputers = 50;
    const memory = intcode.getIntcodeInput(path.join(__dirname, filePath));
    let computers = [...Array(nComputers).keys()].map(index => {
        return {
            memory: Object.assign({}, memory),
            input: [index],
            index: 0,
            relativeBase: 0,
            output: []
        };
    });
    while (true) {
        for (let index = 0; index < nComputers; ++index) {
            if (computers[index].done) {
                return;
            } else if (computers[index].needInput && computers[index].input.length === 0) {
                computers[index].input.push(-1);
            }
            intcode.runIntcode(computers[index]);
            if (computers[index].output.length > 0) {
                for (let packetIndex = 0; packetIndex < computers[index].output.length / 3; ++packetIndex) {
                    const [address, x, y] = computers[index].output.slice(3 * packetIndex, 3 * packetIndex + 3);
                    // console.log(`Packet: ${[address, x, y]}`)
                    if (address === 255) {
                        return [x, y];
                    }
                    computers[address].input.push(...[x, y]);
                }
                computers[index].output = [];
            }
        }
    }
}

module.exports = { runComputers };

// console.log(runComputers('intcode-input.txt'))
