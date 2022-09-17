const fs = require('fs'),
    path = require('path');

function getLayers(filePath, nRows, nColumns) {
    const absoluteFilePath = path.join(__dirname, filePath);
    const imageData = fs.readFileSync(absoluteFilePath, 'utf8').trim().split('').map(Number);
    let layers = [];
    for (let i = 0; i < imageData.length; i += nRows * nColumns) {
        const layer = imageData.slice(i, i + nRows * nColumns);
        let rows = []
        for (let j = 0; j < layer.length; j += nColumns) {
            rows.push(layer.slice(j, j + nColumns));
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

function getVisiblePixels(layers, nRows, nColumns) {
    let picture = new Array(nRows).fill([]);
    for (let row = 0; row < nRows; ++row) {
        picture[row] = new Array(nColumns).fill(null);
    }
    for (let row = 0; row < nRows; ++row) {
        for (let column = 0; column < nColumns; ++column) {
            layers.forEach(layer => {
                if (picture[row][column] === null && layer[row][column] !== 2) {
                    picture[row][column] = layer[row][column];
                }
            })
        }
    }
    return picture;
}

function get1And2In0MinLayer(filePath, nRows, nColumns) {
    const layers = getLayers(filePath, nRows, nColumns);
    const min0Layer = layers[getMinimumDigitLayer(layers, 0)];
    return getNumberOfDigitsInLayer(min0Layer, 1) * getNumberOfDigitsInLayer(min0Layer, 2);
}

function getImageDisplay(filePath, nRows, nColumns) {
    const layers = getLayers(filePath, nRows, nColumns);
    const pixels = getVisiblePixels(layers, nRows, nColumns);
    return '\n' + pixels.map(row =>
        row.map(pixel => pixel === 1 ? '█' : '░')
            .reduce((acc, cur) => acc + cur, '')
    )
        .reduce((acc, cur) => acc + cur + '\n', '');
}

module.exports = { get1And2In0MinLayer, getImageDisplay };
