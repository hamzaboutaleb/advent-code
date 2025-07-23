const fs = require("fs");

const input = fs.readFileSync("input", "utf-8");
const lines = input.trim().split("\n");


const totalCharsMemory = totalCharactersMemory(lines);
const totalCharsQoute = totalCharactersQouteMemory(lines);
const totalChars = totalCharacters(lines);
console.log("total(memory)", totalCharsMemory);
console.log("total", totalChars);
console.log("total with qoute", totalCharsQoute);
console.log("diff part 1", totalCharsMemory - totalChars);
console.log("diff part 2",  totalCharsQoute - totalCharsMemory);

function totalCharacters(lines) {
  let res = 0;
  for (let line of lines) {
    let i = 0;
    line = line.slice(1, -1).trim();
    let len = 0;
    while (i < line.length) {
      if (line.slice(i).match(/^\\x[0-9A-Fa-f]{2}/)) i += 4;
      else if (line.slice(i).match(/^\\(\\|")/)) i += 2;
      else i++;
      len++;
    }
    res += len;
  }
  return res;
}

function totalCharactersMemory(line) {
  let res = 0;
  for (let line of lines) {
    res += line.length;
  }
  return res;
}

function totalCharactersQouteMemory(lines) {
  let res = 0;
  for (let line of lines) {
    let len = 2;
    for (let c of line) {
      if (c == '"' || c == "\\") len += 2;
      else len += 1;
    }

    const sol = JSON.stringify(line);
    if (sol.length != len) {
        console.log(`${line}:${len} - ${sol.length}`)
    }
    res += len
  }
  return res;
}
