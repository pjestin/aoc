const path = require("path"),
  fs = require("fs"),
  DIRECTION_VECTORS = [
    { x: 1, y: 0 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: -1 }
  ];

const getStringPosition = position => `${position.x};${position.y}`;

const getPositionObject = (positionString) => {
  const positionArray = positionString.split(';').map(Number);
  return { x: positionArray[0], y: positionArray[1] };
}

const getInputMap = filePath => {
  const absoluteFilePath = path.join(__dirname, filePath);
  const matrix = fs
    .readFileSync(absoluteFilePath, "utf8")
    .split("\n")
    .map(row => row.trim().split(""));
  let walls = {};
  let keys = {};
  let doors = {};
  let startPositions = [];
  matrix.forEach((row, y) => {
    row.forEach((element, x) => {
      const asciiCode = element.charCodeAt(0);
      if (element === "#") {
        walls[getStringPosition({ x, y })] = true;
      } else if (asciiCode >= 65 && asciiCode <= 90) {
        doors[getStringPosition({ x, y })] = element;
      } else if (asciiCode >= 97 && asciiCode <= 122) {
        keys[getStringPosition({ x, y })] = element;
      } else if (element === "@") {
        startPositions.push({ x, y });
      }
    });
  });
  return [walls, keys, doors, startPositions];
};

const display = (walls, state) => {
  let maxX = Math.max(
    ...Object.keys(walls).map(wall => Number(wall.split(";")[0]))
  );
  let maxY = Math.max(
    ...Object.keys(walls).map(wall => Number(wall.split(";")[1]))
  );
  let tiles = new Array(maxY + 1).fill([]);
  for (let i = 0; i < maxY + 1; ++i) {
    tiles[i] = new Array(maxX + 1).fill(" ");
  }
  Object.keys(walls).forEach(wallStringPosition => {
    const wallPosition = wallStringPosition.split(";").map(Number);
    tiles[wallPosition[1]][wallPosition[0]] = "#";
  });
  Object.keys(state.keys).forEach(keyStringPosition => {
    const keyPosition = keyStringPosition.split(";").map(Number);
    tiles[keyPosition[1]][keyPosition[0]] = state.keys[keyStringPosition];
  });
  Object.keys(state.doors).forEach(doorStringPosition => {
    const doorPosition = doorStringPosition.split(";").map(Number);
    tiles[doorPosition[1]][doorPosition[0]] = state.doors[doorStringPosition];
  });
  state.positions.forEach(position => {
    tiles[position.y][position.x] = "@";
  })
  const display = tiles
    .map(row => row.reduce((rowDisplay, tile) => rowDisplay + tile, ""))
    .reduce((rowDisplay, curRow) => rowDisplay + curRow + "\n", "");
  console.log(display);
};

function noKeyInQuadrant(keys, startPositions, botIndex) {
  let centre = startPositions.reduce((centrePosition, position) => {
    return { x: centrePosition.x + position.x, y: centrePosition.y + position.y };
  },
    { x: 0, y: 0 });
  centre = { x: centre.x / 4, y: centre.y / 4 };
  let foundKey = false;
  Object.keys(keys).forEach(stringPosition => {
    const position = getPositionObject(stringPosition);
    if ((position.x - centre.x) * (startPositions[botIndex].x - centre.x) > 0 &&
      (position.y - centre.y) * (startPositions[botIndex].y - centre.y)) {
      foundKey = true;
    }
  });
  return !foundKey;
}

function navigateMapIterative(walls, startState) {
  let stateQueue = [startState];
  let cachedKeyCombinations = {};
  let visited = {};
  while (stateQueue.length !== 0) {
    const allBotsState = stateQueue.shift();
    // console.log([allBotsState.positions, allBotsState.steps]);
    for (let botIndex = 0; botIndex < allBotsState.positions.length; ++botIndex) {
      // console.log(`Moving bot ${botIndex}`);
      if (allBotsState.positions.length > 1 && noKeyInQuadrant(allBotsState.keys, startState.positions, botIndex)) {
        continue;
      }

      let state = JSON.parse(JSON.stringify(allBotsState));

      const stringPosition = getStringPosition(state.positions[botIndex]);
      if (stringPosition in state.keys) {
        const doorStringPosition = Object.keys(state.doors).reduce(
          (doorStringPosition, curDoor) =>
            state.doors[curDoor].toLowerCase() === state.keys[stringPosition]
              ? curDoor
              : doorStringPosition,
          null
        );
        state.acquiredKeys[botIndex].sort();
        state.acquiredKeys[botIndex].push(state.keys[stringPosition]);
        state.acquiredKeysString = state.acquiredKeys.reduce(
          (acc, botKeys) => acc + botKeys.reduce((botAcc, cur) => botAcc + cur, ''),
          ""
        );
        if (state.acquiredKeysString in cachedKeyCombinations) {
          continue;
        }
        // console.log(`Acquired key: ${state.keys[stringPosition]}`);
        delete state.doors[doorStringPosition];
        delete state.keys[stringPosition];
        cachedKeyCombinations[state.acquiredKeysString] = true;
        const nKeys = Object.keys(state.keys).length;
        stateQueue.push(state);
        // console.log(`Steps: ${state.steps}`);
        // console.log(`Keys left: ${nKeys}`);
        // console.log(`Remaining states in queue: ${stateQueue.length}`);
        // console.log(`Acquired keys: ${state.acquiredKeys}`);
        // console.log(`Number of combinations: ${Object.keys(cachedKeyCombinations).length}`)
        // display(walls, state);
        if (nKeys === 0) {
          return state;
        }
      }

      if (!(state.acquiredKeysString in visited)) {
        visited[state.acquiredKeysString] = {};
      }
      visited[state.acquiredKeysString][stringPosition] = true;

      DIRECTION_VECTORS.forEach(direction => {
        const nextPosition = {
          x: state.positions[botIndex].x + direction.x,
          y: state.positions[botIndex].y + direction.y
        };
        const nextPositionString = getStringPosition(nextPosition);
        if (
          nextPositionString in visited[state.acquiredKeysString] ||
          nextPositionString in walls ||
          nextPositionString in state.doors
        ) {
          return;
        }
        let nextState = JSON.parse(JSON.stringify(state));
        nextState.positions[botIndex] = nextPosition;
        nextState.steps++;
        stateQueue.push(nextState);
      });
    }
  }
  return null;
}

function runNavigation(filePath) {
  let [walls, keys, doors, startPositions] = getInputMap(filePath);
  let state = {
    keys,
    doors,
    positions: startPositions,
    steps: 0,
    acquiredKeys: new Array(startPositions.length).fill([]),
    acquiredKeysString: ""
  };
  return navigateMapIterative(walls, state).steps;
}

module.exports = { runNavigation };

// console.log(runNavigation('input-part2.txt'))
