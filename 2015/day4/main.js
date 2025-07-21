const crypto = require("crypto");

function md5(data) {
  const hash = crypto.createHash("md5");
  hash.update(data);
  return hash.digest("hex"); // Returns the hash as a hexadecimal string
}

const SECRET_KEY = "iwrupvqb"

function isValidHash(n, hash) {
    return hash.startsWith("0".repeat(n));
}

function mining(n) {
    let i = 1;

    while (true) {
        let hash = md5(SECRET_KEY + i)
        if (isValidHash(n, hash)) return i
        i++;
    }
}

console.log("the lowest positive number that produces such a hash (5 zeros)", mining(5));
console.log("the lowest positive number that produces such a hash (6 zeros)", mining(6));