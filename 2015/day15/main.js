const fs = require('fs');
class Ingredient {
  constructor(name, properties) {
    this.name = name;
    this.properties = properties;
  }

  getProperty(property) {
    return this.properties[property] || 0;
  }
}

function parseInput(input) {
    input = input.trim().split("\n").map(line => {
        const parts = line.split(': ');
        const name = parts[0];
        const properties = parts[1].split(', ').reduce((acc, prop) => {
            const [key, value] = prop.split(' ');
            acc[key] = parseInt(value);
            return acc;
        }, {});
        return new Ingredient(name, properties);
    });
    return input;
}


const input = fs.readFileSync('input', 'utf-8');
const ingredients = parseInput(input);


function calculateScore(ingredients, quantity, filter) {
    let props  = {};
    let result = 1;
    ingredients.forEach(ing => {
        Object.entries(ing.properties).forEach(([name, value]) => {
            if (filter.includes(name)) return;
            props[name] = (props[name] || 0) + value * quantity[ing.name]
        })
    })

    result = Object.values(props).reduce((acc, value) => acc * Math.max(value, 0), 1);

    return Math.max(result, 0);
}

function calculateScoreBasedOnCalories(ingredients, quantity, expectedCalories) {
    let props  = {};
    let result = 1;
    ingredients.forEach(ing => {
        Object.entries(ing.properties).forEach(([name, value]) => {
            props[name] = (props[name] || 0) + value * quantity[ing.name]
        })
    })

    if (props["calories"] != expectedCalories)
        return 0;
    props["calories"] = 1;
    result = Object.values(props).reduce((acc, value) => acc * Math.max(value, 0), 1);

    return Math.max(result, 0);
}


function highestScore(ingredients, current = 0, spoons = 100, quantity = {}) {
  if (spoons == 0) {
      let value = calculateScore(ingredients, quantity, ["calories"])
    return value;
  }
  if (current >= ingredients.length) {
    return -Infinity
  }

  let max = -Infinity
  let ingred = ingredients[current]
  for (let i = 1; i <= spoons; i++) {
    quantity[ingred.name] = i;
    max = Math.max(max, highestScore(ingredients, current + 1, spoons - i, quantity))
  }
  quantity[ingred.name] = 0
  return max
}

function highestScoreBasedOnCalories(ingredients, current = 0, spoons = 100, quantity = {}) {
  if (spoons == 0) {
    let value = calculateScoreBasedOnCalories(ingredients, quantity, 500)
    return value;
  }
  if (current >= ingredients.length) {
    return -Infinity
  }

  let max = -Infinity
  let ingred = ingredients[current]
  for (let i = 1; i <= spoons; i++) {
    quantity[ingred.name] = i;
    max = Math.max(max, highestScoreBasedOnCalories(ingredients, current + 1, spoons - i, quantity))
  }
  quantity[ingred.name] = 0
  return max
}

console.log("Highest Score:", highestScore(ingredients))
console.log("Highest Score Part2:", highestScoreBasedOnCalories(ingredients))