const fs = require("fs");

const OFF = ".";
const ON = "#";

const input = fs
  .readFileSync("input", "utf-8")
  .trim()
  .split("\n")
  .map((line) => line.split(""));

function newLed(grid, row, col) {
  let neghboursOn = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      if (i == 0 && j == 0) continue;
      try {
        neghboursOn += grid[i + row][j + col] == ON ? 1 : 0;
      } catch (error) {}
    }
  }

  if (grid[row][col] == OFF && neghboursOn == 3) {
    return ON;
  }
  if (grid[row][col] == ON && (neghboursOn == 2 || neghboursOn == 3)) {
    return ON;
  }
  return OFF;
}

function newGrid(oldGrid) {
  let newGrid = [];
  for (let i = 0; i < oldGrid.length; i++) {
    newGrid.push([]);
    for (let j = 0; j < oldGrid[i].length; j++) {
      newGrid[i].push(newLed(oldGrid, i, j));
    }
  }
  return newGrid;
}

function countOnLed(grid) {
  let result = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == ON) result++;
    }
  }
  return result;
}

function animate(grid, n, gridGenerator) {
  for (let i = 0; i < n; i++) {
    grid = gridGenerator(grid);
  }
  return grid;
}

function newGridCornerOn(oldGrid) {
  let newGrid = [];
  for (let i = 0; i < oldGrid.length; i++) {
    newGrid.push([]);
    for (let j = 0; j < oldGrid[i].length; j++) {
      if (isCorner(oldGrid, i, j)) {
        newGrid[i].push(ON);
      } else {
        newGrid[i].push(newLed(oldGrid, i, j));
      }
    }
  }
  return newGrid;
}

function setCornersOn(grid) {
  const colLen = grid[0].length;
  const rowLen = grid.length;
  grid[0][0] = ON;
  grid[0][colLen - 1] = ON;
  grid[rowLen - 1][0] = ON;
  grid[rowLen - 1][colLen - 1] = ON;
}

function isCorner(grid, i, j) {
  const colLen = grid[0].length;
  const rowLen = grid.length;
  return (
    (i == 0 && j == 0) ||
    (i == 0 && j == colLen - 1) ||
    (i == rowLen - 1 && j == 0) ||
    (i == rowLen - 1 && j == colLen - 1)
  );
}

let lastGrid = animate(input, 100, newGrid);

console.log(
  "how many lights are on after 100 steps part 1",
  countOnLed(lastGrid)
);

setCornersOn(input);
lastGrid = animate(input, 100, newGridCornerOn);
console.log(
  "how many lights are on after 100 steps Part 2",
  countOnLed(lastGrid)
);
