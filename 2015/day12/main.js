const fs = require("fs");
const JSONs = require("./json");


const input = fs.readFileSync("input", "utf-8");

const tokens = JSONs.tokens(input);

console.log("What is the sum of all numbers in the document?", sumNumbers(tokens))

function sumNumbers(tokens) {
    let res = 0;

    for (let token of tokens) {
        if (token.type == "NUMBER") {
            res += Number(token.value)
        }
    }

    return res;
}

const obj = JSONs.parse(input);


function sumNumbersExceptRed(input) {
    if (typeof input == "number") return input;
    if (typeof input == "string") return 0;
    if (Array.isArray(input)) {
        let sum = 0;
        for (value of input) {
            sum += sumNumbersExceptRed(value);
        }
        return sum
    }
    if (typeof input == "object") {
        let sum = 0;

        for (const [key, value] of Object.entries(input)) {
            if (value === "red") return 0;
            sum += sumNumbersExceptRed(value)
        }
        return sum
    }
    return 0;
}

console.log("sum numbers axcept objects with value red",sumNumbersExceptRed(obj))