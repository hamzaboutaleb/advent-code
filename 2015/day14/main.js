const fs = require('fs');

class Person {
    constructor(speed, maxTime, restTime)
    {
        this.speed = speed;
        this.maxTime = maxTime;
        this.restTime = restTime;

    }
}

const input = fs.readFileSync('input', 'utf8').trim().split('\n').map(line => {
    const parts = line.split(' ');
    return new Person(
        parseInt(parts[3]),
        parseInt(parts[6]),
        parseInt(parts[13])
    );
});

function calculateDistance(time, person) {
    const fullCycles = Math.floor(time / (person.maxTime + person.restTime));
    const remainingTime = time % (person.maxTime + person.restTime);
    const activeTime = Math.min(remainingTime, person.maxTime);
    
    return (fullCycles * person.maxTime + activeTime) * person.speed;
}

function findMaxDistance(time) {
    return input.reduce((max, person) => {
        const distance = calculateDistance(time, person);
        return Math.max(max, distance);
    }, 0);
}

function findMaxPoints(time) {
    const points = Array(input.length).fill(0);
    for (let t = 1; t <= time; t++) {
        let maxDistance = 0;
        input.forEach((person, index) => {
            const distance = calculateDistance(t, person);
            if (distance > maxDistance) {
                maxDistance = distance;
            }
        });
        input.forEach((person, index) => {
            if (calculateDistance(t, person) === maxDistance) {
                points[index]++;
            }
        });
    }
    return Math.max(...points);
}


const time = 2503;

console.log(findMaxPoints(time));
console.log(findMaxDistance(time));