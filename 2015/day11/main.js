const input = "vzbxkghb";

console.log(`next valid password: ${findNextValidPassword(input)}`);
console.log(`next valid password: ${findNextValidPassword(findNextValidPassword(input))}`);
function incrementPassword(password) {
    const chars = password.split('');
    let i = chars.length - 1;
    while (i >= 0) {
        if (chars[i] === 'z') {
            chars[i] = 'a';
            i--;
        } else {
            chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
            break;
        }
    }
    return chars.join('');
}

function hasIncreaseStraight(password) {
    for (let i = 0; i < password.length - 2; i++) {
        if (password.charCodeAt(i + 1) === password.charCodeAt(i) + 1 &&
            password.charCodeAt(i + 2) === password.charCodeAt(i) + 2) {
            return true;
        }
    }
    return false;
}

function hasForbiddenChars(password, chars) {
    return password.split('').some(char => chars.includes(char));
}

function hasOverlappingPairs(password) {
    let pairs = new Set();
    for (let i = 0; i < password.length - 1; i++) {
        if (password[i] === password[i + 1]) {
            pairs.add(password[i]);
            i++;
        }
    }
    return pairs.size >= 2;
}

function isValidPassword(password) {
    return hasIncreaseStraight(password) &&
           !hasForbiddenChars(password, ['i', 'o', 'l']) &&
           hasOverlappingPairs(password);
}

function findNextValidPassword(password) {
    let nextPassword = incrementPassword(password);
    while (!isValidPassword(nextPassword)) {
        nextPassword = incrementPassword(nextPassword);
    }
    return nextPassword;
}