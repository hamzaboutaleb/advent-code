const fs = require("fs");

class Grid {
  constructor(row, col) {
    this.row = row;
    this.col = col;
    this.grid = Array(row)
      .fill()
      .map((r) => Array(col).fill(0));
  }

  range([startX, startY], [endX, endY], callback) {
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        this.grid[i][j] = callback(this.grid[i][j]);
      }
    }
  }

  countOnLigth() {
    let res = 0;
    for (let row of this.grid) {
      for (let col of row) {
        if (col == 1) res++;
      }
    }
    return res;
  }

  countBrightness() {
    let res = 0;
    for (let row of this.grid) {
      for (let col of row) {
        res += col;
      }
    }
    return res;
  }

  reset() {
    this.grid = Array(this.row)
      .fill()
      .map((r) => Array(this.col).fill(0));
  }
}

const COMMANDS = {
  toggle: (input) => (input == 0 ? 1 : 0),
  on: (input) => 1,
  off: (input) => 0,
};

const COMMANDS2 = {
  toggle: (input) => input + 2,
  on: (input) => input + 1,
  off: (input) => Math.max(input - 1, 0),
};

const input = fs.readFileSync("input", "utf8").trim().split("\n");

function parseInput(input) {
  const commands = [];
  for (const line of input) {
    const sep = line.split(" ");
    if (sep.length == 4) {
      const [cmd, start, _, end] = sep;
      commands.push({
        type: cmd,
        start: start.split(",").map(Number),
        end: end.split(",").map(Number),
      });
    } else {
      const [cmd, actin, start, _, end] = sep;
      commands.push({
        type: actin,
        start: start.split(",").map(Number),
        end: end.split(",").map(Number),
      });
    }
  }
  return commands;
}

const grid = new Grid(1000, 1000);
const commands = parseInput(input);

function applyCommands(grid, commands, callbacks) {
    grid.reset()
  for (let cmd of commands) {
    let callback = callbacks[cmd.type];
    grid.range(cmd.start, cmd.end, callback);
  }
}
applyCommands(grid, commands, COMMANDS);
console.log("how many lights are lit?", grid.countOnLigth());
applyCommands(grid, commands, COMMANDS2);
console.log("What is the total brightness", grid.countBrightness());
