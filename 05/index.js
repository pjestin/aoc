const fs = require('fs'),
    path = require('path'),
    runIntcode = require('../lib/intcode'),
    INPUT_FILE_PATH = path.join(__dirname, 'intcode-input.json'),
    INITIAL_INTCODE = JSON.parse(fs.readFileSync(INPUT_FILE_PATH, 'utf8'));

const result = runIntcode(Object.assign({}, INITIAL_INTCODE), [5], 0, 0);
console.log(result.output);
