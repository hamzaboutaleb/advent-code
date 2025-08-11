const fs = require("fs");

let input = fs.readFileSync("input", "utf8").trim();
const containers = input.split("\n").map(Number);

console.log(containers);

function countContainer(containers, reset, reserved = 0) {
  if (reset == 0) {
    return 1;
  } else if (reset < 0) {
    return 0;
  }
  let sum = 0;
  for (let i = reserved; i < containers.length; i++) {
    let value = containers[i];
    sum += countContainer(containers, reset - value, i + 1);
  }
  return sum;
}
let globalFilled = [];
function countMinContainer(containers, reset, start = 0, filled = []) {
  if (reset == 0) {
    globalFilled.push([...filled]);
    return filled.length;
  } else if (reset < 0) {
    return Infinity;
  }
  let min = Infinity;
  for (let i = start; i < containers.length; i++) {
    let value = containers[i];
    min = Math.min(min, countMinContainer(containers, reset - value, i + 1, [...filled, i]));
  }
  return min;
}


console.log("count containers part 1", countContainer(containers, 150));
let min = countMinContainer(containers, 150);
let countMin = globalFilled.reduce((acc, curr) => {
  if (curr.length === min) {
    return acc + 1;
  }
  return acc;
}, 0);
console.log("min number containers part 2", countMin);
