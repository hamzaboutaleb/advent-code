const fs = require("fs");

class Box {
  constructor(length, width, height) {
    this.length = length;
    this.width = width;
    this.height = height;
  }

  top() {
    return 2 * this.length * this.width;
  }

  front() {
    return 2 * this.width * this.height;
  }

  left() {
    return 2 * this.height * this.length;
  }

  surface_area() {
    return this.top() + this.front() + this.left();
  }

  paper_needed() {
    return this.surface_area() + Math.min(this.top(), this.front(), this.left()) / 2
  }

  ribonWrap() {
    let face1 = 2  * (this.length + this.width);
    let face2 = 2 * (this.length + this.height);
    let face3 = 2 * (this.width + this.height);
    return Math.min(face1, face2, face3);
  }

  ribonBow() {
    return this.width * this.height * this.length
  }
} 

function readData() {
    const filename = "input";
    const data = fs.readFileSync(filename, "utf-8").split("\n");
    const boxes = []
    for (let dim of data) {
        const [l, w, h] = dim.split("x").map(Number);
        const box = new Box(l, w, h);
        boxes.push(box);
    }
    return boxes;
}

function totalRibon(boxes) {
    return boxes.reduce((acc, box) => acc + box.ribonWrap() + box.ribonBow(), 0);
}

function getTotalPaper(boxes) {
    return boxes.reduce((acc, c) => acc + c.paper_needed(), 0)
}

const boxes = readData();



console.log("total square feet of wrapping paper should they order", getTotalPaper(boxes))
console.log("total feet of ribbon should they order", totalRibon(boxes))