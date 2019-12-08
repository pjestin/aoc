const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'image-input.txt'),
    IMAGE_DATA = fs.readFileSync(INPUT_FILE_PATH, 'utf8').trim().split('').map(Number),
    ROWS = 6,
    COLUMNS = 25;

function getLayers(image_data) {
    let layers = [];
    for (let i = 0; i < image_data.length; i += ROWS * COLUMNS) {
        const layer = image_data.slice(i, i + ROWS * COLUMNS);
        let rows = []
        for (let j = 0; j < layer.length; j += COLUMNS) {
            rows.push(layer.slice(j, j + COLUMNS));
        }
        layers.push(rows);
    }
    return layers;
}

function getNumberOfDigitsInLayer(layer, digit) {
    return layer.reduce((count, curRow) =>
        count + curRow.filter(x => x === digit).length,
        0);
}

function getMinimumDigitLayer(layers, digit) {
    const numberOfDigits = layers.map(layer => getNumberOfDigitsInLayer(layer, digit));
    let min = Infinity;
    let minIndex = 0;
    numberOfDigits.forEach((n, index) => {
        if (n < min) {
            min = n;
            minIndex = index;
        }
    });
    return minIndex;
}

function getVisiblePixels(layers) {
    let picture = new Array(ROWS).fill([]);
    for (let row = 0; row < ROWS; ++row) {
        picture[row] = new Array(COLUMNS).fill(null);
    }
    for (let row = 0; row < ROWS; ++row) {
        for (let column = 0; column < COLUMNS; ++column) {
            layers.forEach(layer => {
                if (picture[row][column] === null && layer[row][column] !== 2) {
                    picture[row][column] = layer[row][column];
                }
            })
        }
    }
    return picture;
}

function getImageDisplay(pixels) {
    return pixels.map(row =>
        row.map(pixel => pixel === 1 ? '█' : '░')
            .reduce((acc, cur) => acc + cur, '')
    )
        .reduce((acc, cur) => acc + cur + '\n', '');
}

const layers = getLayers(IMAGE_DATA);
const min0Layer = layers[getMinimumDigitLayer(layers, 0)];
const digits1And2 = getNumberOfDigitsInLayer(min0Layer, 1) * getNumberOfDigitsInLayer(min0Layer, 2);
console.log(digits1And2);

const pixels = getVisiblePixels(layers);
console.log(getImageDisplay(pixels));
