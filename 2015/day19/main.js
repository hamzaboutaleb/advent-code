const fs = require("fs");

const [replacementInput, molecule] = fs
  .readFileSync("input", "utf-8")
  .split("\n\n");

const replacement = replacementInput.split("\n").reduce((acc, curr) => {
  const [key, value] = curr.split(" => ");
  if (acc[key] == undefined) {
    acc[key] = [];
  }
  acc[key].push(value);
  return acc;
}, {});

function countDistinctMolecules(molecule, replacement) {
  let molecules = new Set();
  for (const [key, values] of Object.entries(replacement)) {
    let startIndex = 0;
    while ((startIndex = molecule.indexOf(key, startIndex)) !== -1) {
      for (const value of values) {
        const newMolecule =
          molecule.slice(0, startIndex) +
          value +
          molecule.slice(startIndex + key.length);
        molecules.add(newMolecule);
      }
      startIndex++;
    }
  }
  return molecules.size;
}

function getDistinctMolecules(molecule, replacement) {
  let molecules = new Set();
  for (const [key, values] of Object.entries(replacement)) {
    let startIndex = 0;
    while ((startIndex = molecule.indexOf(key, startIndex)) !== -1) {
      for (const value of values) {
        const newMolecule =
          molecule.slice(0, startIndex) +
          value +
          molecule.slice(startIndex + key.length);
        molecules.add(newMolecule);
      }
      startIndex++;
    }
  }
  return molecules;
}

function reverseObj(replacement) {
  const reversed = {};
  for (const [key, values] of Object.entries(replacement)) {
    for (const value of values) {
      if (!reversed[value]) {
        reversed[value] = [];
      }
      reversed[value].push(key);
    }
  }
  return reversed;
}

function minToGetMoleculeToE(startMolecule, replacement) {
  let reversed = reverseObj(replacement);
  let reversedReplacements = Object.entries(reversed);
  reversedReplacements.sort((a, b) => b[0].length - a[0].length);
  let molecule = startMolecule;
  let steps = 0;
  while (molecule !== "e") {
    for (const [to, from] of reversedReplacements) {
      const newMolecule = molecule.replace(to, from);
      if (newMolecule !== molecule ) {
        molecule = newMolecule
        steps++;
        break;
      }
    }
  }
  return steps;
}

console.log("part 1:", countDistinctMolecules(molecule, replacement));
console.log("part 2:", minToGetMoleculeToE(molecule, replacement));
