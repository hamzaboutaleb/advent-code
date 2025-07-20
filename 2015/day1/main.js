// import { readFile } from "fs/promises";
const fs = require('fs');

const UP = "(";
const DOWN = ")";

function getFloor(input) {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c == UP) result++;
    else if (c == DOWN) result--;
  }
  return result;
}

function getBasementFloorId(input) {
  let result = 0;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (c == UP) result++;
    else if (c == DOWN) result--;
    if (result == -1) return i + 1
  }
  return 0;
}

function main() {
  const filename = process.argv[2];
  try {
    const data = fs.readFileSync(filename, "utf-8");
    const floor = getFloor(data);
    const basement = get_basement_floor_id(data);

    console.log(`floor: ${floor}`);
    console.log(`the position of the character that causes Santa to first enter the basement ${basement}`)
  } catch (error) {
    console.error(error);
  }
}
main();
