const input = "1113222113"


function zipNumber(str) {
    let result = ""
    for (let i = 0; i < str.length;) {
        let start = i;
        while (i < str.length && str[start] == str[i]) i++;
        const len = i - start;
        result = result + len + str[start]
    }
    return result
}

function repeat(n, input, callback) {
    for(let i = 0; i < n; i++)
    {
        input = callback(input);
    }
    return input
}

const result = repeat(50, input, zipNumber)
console.log(`result: ${result}, length ${result.length}`)