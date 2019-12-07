const fs = require('fs'),
    path = require('path'),
    INPUT_FILE_PATH = path.join(__dirname, 'wires-input.txt');

function readWiresInput() {
    return fs.readFileSync(INPUT_FILE_PATH, 'utf8')
        .split('\n')
        .map(moves => {
            return moves.split(',')
                .map(move => {
                    return {
                        "direction": move[0],
                        "distance": parseInt(move.slice(1), 10)
                    };
                });
        })
}

function wirePositions(wire) {
    let current = { "x": 0, "y": 0, "steps": 0 };
    let positions = [];
    wire.forEach(move => {
        switch (move.direction) {
            case 'R':
                current.x += move.distance;
                break;
            case 'L':
                current.x -= move.distance;
                break;
            case 'U':
                current.y += move.distance;
                break;
            case 'D':
                current.y -= move.distance;
                break;
        }
        current.steps += move.distance;
        positions.push({ "x": current.x, "y": current.y, "steps": current.steps });
    });
    return positions;
}

function intersect(a, b) {
    let t;
    if (b.length > a.length) t = b, b = a, a = t;
    let previousPointB = { "x": 0, "y": 0, "steps": 0 };
    let intersection = [];
    b.forEach(pointB => {
        let previousPointA = { "x": 0, "y": 0, "steps": 0 };
        a.forEach(pointA => {
            if (pointB.x === previousPointB.x && pointA.y === previousPointA.y) {
                if ((pointB.x <= pointA.x && pointB.x >= previousPointA.x) ||
                    (pointB.x >= pointA.x && pointB.x <= previousPointA.x)) {
                    if ((pointA.y <= pointB.y && pointA.y >= previousPointB.y) ||
                        (pointA.y >= pointB.y && pointA.y <= previousPointB.y)) {
                        let steps = previousPointA.steps + Math.abs(pointB.x - previousPointA.x)
                            + previousPointB.steps + Math.abs(pointA.y - previousPointB.y);
                        intersection.push({ "x": pointB.x, "y": pointA.y, "steps": steps });
                    }
                }
            } else if (pointB.y === previousPointB.y && pointA.x === previousPointA.x) {
                if ((pointB.y <= pointA.y && pointB.y >= previousPointA.y) ||
                    (pointB.y >= pointA.y && pointB.y <= previousPointA.y)) {
                    if ((pointA.x <= pointB.x && pointA.x >= previousPointB.x) ||
                        (pointA.x >= pointB.x && pointA.x <= previousPointB.x)) {
                        let steps = previousPointA.steps + Math.abs(pointB.y - previousPointA.y)
                            + previousPointB.steps + Math.abs(pointA.x - previousPointB.x);
                        intersection.push({ "x": pointA.x, "y": pointB.y, "steps": steps });
                    }
                }
            }
            previousPointA = pointA;
        });
        previousPointB = pointB;
    });
    console.log(intersection);
    return intersection;
}

function getNearestPoint(points) {
    return intersections.reduce((min, point) => {
        if (point.steps !== 0 && point.steps < min) {
            min = point.steps;
        }
        return min;
    }, Infinity);
}

wires = readWiresInput();
wire1Positions = wirePositions(wires[0]);
wire2Positions = wirePositions(wires[1]);
intersections = intersect(wire1Positions, wire2Positions);
console.log(getNearestPoint(intersections));