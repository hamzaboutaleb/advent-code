const fs = require("fs");

class Person {
  constructor(name, happiness = new Map()) {
    this.name = name;
    this.happiness = happiness;
  }

  addHappinessScore(name, score) {
    this.happiness.set(name, score);
  }

  getHappiness(name) {
    return this.happiness.get(name) || 0;
  }
}

class Table {
  constructor() {
    this.table = [];
  }

  get length() {
    return this.table.length;
  }

  add(person) {
    this.table.push(person);
  }

  pop() {
    this.table.pop();
  }

  has(person) {
    return this.table.find((value) => value.name == person.name) !== undefined
  }

  calculateHappinessScore() {
    let result = 0;
    for (let i = 0; i < this.table.length; i++) {
      let prev = (i + this.table.length - 1) % this.table.length;
      let next = (i + 1) % this.table.length;
      let current = this.table[i];
      result +=
        current.getHappiness(this.table[prev].name) + current.getHappiness(this.table[next].name);
    }
    return result;
  }

  clear() {
    this.table = [];
  }
}

class Parser {
  constructor(source) {
    this.source = source;
    this.family = new Map();
  }

  parse() {
    const lines = this.source.split("\n");

    for (let line of lines) {
      const tokens = line.split(" ");
      let source = tokens[0];
      let sign = tokens[2];
      let value = tokens[3];
      let score = this.score(sign, value);
      let target = tokens[10].slice(0, -1);

      const person = this.family.get(source) || new Person(source);
      person.addHappinessScore(target, score);
      this.family.set(source, person);
    }
    return this.family;
  }

  score(sign, value) {
    if (sign == "gain") return Number(value);
    return -Number(value);
  }
}


function findOptimalarrangement(people, table = new Table(), maxScore = 0) {
    if (table.length == people.length) {
    let score = table.calculateHappinessScore();
    if (score > maxScore) {
      maxScore = score;
    }
    return maxScore;
  }

  for (let i = 0; i < people.length; i++) {
    if (table.has(people[i])) continue;
    table.add(people[i]);
    maxScore = findOptimalarrangement(people, table, maxScore);
    table.pop();
  }
  return maxScore;
}

const input = fs.readFileSync("input", "utf-8");

const parser = new Parser(input);
let family = parser.parse();
let people = [...family.values()];
let maxScore = findOptimalarrangement(people);
console.log("part 1",maxScore);

// Part 2
const me = new Person("me");
people.push(me);
maxScore = findOptimalarrangement(people);
console.log("part 2", maxScore);
