const fs = require("fs")

const VOWELS = new Set([..."ouiae"]);

function countVowels(s) {
  let res = 0;
  for (c of s) {
    if (VOWELS.has(c)) res++;
  }
  return res;
}

function hasDoubleLetter(s) {
  for (let i = 0; i < s.length - 1; i++) {
    let curr = s[i];
    let next = s[i + 1];
    if (curr == next) return true;
  }
  return false;
}

function hasRepeatedPair(s) {
  for (let i = 0; i < s.length - 1; i++) {
    let pair = s.slice(i, i + 2);
    let rest = s.slice(i + 2);
    if (rest.includes(pair)) return true;
  }
  return false;
}

function hasForbiddenStrings(str, forbidden) {
  return forbidden.some((pair) => str.includes(pair));
}

function isNiceString(s) {
  return (
    countVowels(s) >= 3 &&
    hasDoubleLetter(s) &&
    !hasForbiddenStrings(s, ["ab", "cd", "pq", "xy"])
  );
}

function hasLetterBetweenRepatedLetter(s) {
    for (let i = 0; i < s.length - 2; i++) {
        let start = s[i];
        let end = s[i + 2];
        if (start == end) return true
    }
    return false
}

function isNiceStringPart2(s) {
  return (
    hasRepeatedPair(s) && hasLetterBetweenRepatedLetter(s)
  );
}

function countNiceStrings(strs, fn) {
    let res = 0;
    for (s of strs) {
        if (fn(s)) res++;
    }
    return res;
}

const data = fs.readFileSync("input", "utf-8");
const lines = data.split("\n");

console.log("Nice strings:", countNiceStrings(lines, isNiceString))
console.log("Nice strings part 2:", countNiceStrings(lines, isNiceStringPart2))

