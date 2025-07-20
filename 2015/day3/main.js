const fs = require("fs");

const UP = "^";
const DOWN = "v";
const LEFT = "<";
const RIGHT = ">";

const data = fs.readFileSync("input", "utf-8");

function deliverGifts(input) {
  const position = {
    x: 0,
    y: 0,
  };

  const houses = new Set();
  houses.add("0,0");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c == UP) {
      position.y--;
    } else if (c == DOWN) {
      position.y++;
    } else if (c == LEFT) {
      position.x++;
    } else if (c == RIGHT) {
      position.x--;
    }
    const houseCord = `${position.x},${position.y}`;
    houses.add(houseCord);
  }
  return houses.size;
}

function deliverGiftsWithRobot(input) {
  const santaPos = {
    x: 0,
    y: 0,
  };
  const robotPos = {
    x: 0,
    y: 0,
  };

  const houses = new Set();
  houses.add("0,0");
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if ((i + 1) % 2 == 0) {
        move(c, santaPos)
    } else
        move(c, robotPos)
    const santaHouseCord = `${santaPos.x},${santaPos.y}`;
    const RobotHouseCord = `${robotPos.x},${robotPos.y}`;
    houses.add(santaHouseCord);
    houses.add(RobotHouseCord);
  }
  return houses.size;
}

function move(cmd, pos) {
  if (cmd == UP) {
    pos.y--;
  } else if (cmd == DOWN) {
    pos.y++;
  } else if (cmd == LEFT) {
    pos.x++;
  } else if (cmd == RIGHT) {
    pos.x--;
  }
}

console.log(
  "How many houses receive at least one present?",
  deliverGifts(data)
);
console.log(
  "How many houses receive at least one present (with robot)?",
  deliverGiftsWithRobot(data)
);
