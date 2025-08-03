const fs = require("fs");

class Sue {
  constructor(name) {
    this.name = name;
    this.gifts = {};
  }

  has(name, value) {
    return this.gifts[name] == value;
  }

  set(name, value) {
    this.gifts[name] = value;
  }
}

const lines = fs.readFileSync("input", "utf8").trim().split("\n");
const sues = lines.map((line) => {
  let [first, ...gifts] = line.split(", ");
  const [name, ...gift] = first.split(": ");
  gifts = [...gifts, gift.join(": ")];
  const sue = new Sue(name);
  for (let gift of gifts) {
    const [name, value] = gift.split(": ");
    sue.set(name, Number(value));
  }
  return sue;
});

const MFCSAM = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

function SuesGotMeGifts(sues, MFCSAM) {
    for (let sue of sues) {
        let hasAllGifts = true;
        for (let gift in sue.gifts) {
            if (!sue.has(gift, MFCSAM[gift])) {
                hasAllGifts = false;
                break;
            }
        }
        if (hasAllGifts) {
            return sue.name.split(" ")[1];
        }
    }
}

function SuesGotMeGiftsPart2(sues, MFCSAM) {
    for (let sue of sues) {
        let hasAllGifts = true;
        for (let gift in sue.gifts) {
            if (gift === "cats" || gift === "trees") {
                if (sue.gifts[gift] <= MFCSAM[gift]) {
                    hasAllGifts = false;
                    break;
                }
            } else if (gift === "pomeranians" || gift === "goldfish") {
                if (sue.gifts[gift] >= MFCSAM[gift]) {
                    hasAllGifts = false;
                    break;
                }
            } else if (!sue.has(gift, MFCSAM[gift])) {
                hasAllGifts = false;
                break;
            }
        }
        if (hasAllGifts) {
            return sue.name.split(" ")[1];
        }
    }
}

console.log("Part 1:", SuesGotMeGifts(sues, MFCSAM));
console.log("Part 2:", SuesGotMeGiftsPart2(sues, MFCSAM));