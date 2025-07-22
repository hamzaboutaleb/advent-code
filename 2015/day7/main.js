const fs = require("fs");

const keywords = new Set(["AND", "OR", "LSHIFT", "RSHIFT", "NOT"]);

const TOKEN_TYPE = {
  AND: "AND",
  OR: "OR",
  LSHIFT: "LSHIFT",
  RSHIFT: "RSHIFT",
  NOT: "NOT",
  ARROW: "ARROW",
  NUMBER: "NUMBER",
  IDENTIFIER: "IDENTIFIER",
  EOF: "EOF",
};

const callback = {
  AND: (left, right) => left & right,
  OR: (left, right) => left | right,
  NOT: (value) => ~value & 0xffff,
  LSHIFT: (value, i) => value << i,
  RSHIFT: (value, i) => value >> i,
};

class Tokenizer {
  constructor(source) {
    this.source = source;
    this.current = 0;
    this.tokens = [];
  }

  isEOF() {
    return this.current >= this.source.length;
  }

  peek() {
    if (this.isEOF()) return "\0";
    return this.source[this.current];
  }

  advance() {
    const curr = this.peek();
    this.current++;
    return curr;
  }

  match(expected) {
    if (this.peek() != expected) {
      return false;
    }
    this.advance();
    return true;
  }

  tokenize() {
    while (!this.isEOF()) {
      this.start = this.current;
      this.nextToken();
    }
    this.addToken(TOKEN_TYPE.EOF);
    return this.tokens;
  }

  nextToken() {
    const c = this.advance();

    if (this.isWhitespace(c)) {
      return;
    } else if (c == "-") {
      if (this.match(">")) {
        this.addToken(TOKEN_TYPE.ARROW);
        return;
      }
      throw new Error("Invalid token");
    } else if (this.isNumber(c)) {
      this.number();
    } else if (this.isAlpha(c)) {
      this.identifer();
    }
  }

  isNumber(char) {
    return /^\d$/.test(char);
  }

  identifer() {
    while (this.isAlpha(this.peek())) this.advance();
    let value = this.source.substring(this.start, this.current);
    if (keywords.has(value)) {
      this.addToken(TOKEN_TYPE[value]);
    } else {
      this.addToken(TOKEN_TYPE.IDENTIFIER);
    }
  }

  number() {
    while (this.isNumber(this.peek())) this.advance();
    this.addToken(TOKEN_TYPE.NUMBER);
  }

  isAlpha(str) {
    return /^[a-zA-Z]*$/.test(str);
  }

  isWhitespace(c) {
    /\s/.test(c);
  }

  addToken(type) {
    const token = {
      type,
      value: this.source.substring(this.start, this.current),
    };
    this.tokens.push(token);
  }
}

//----------------------------- AST NODES --------------------

class Integer {
  constructor(value) {
    this.value = value;
  }

  deps() {
    return [];
  }
}

class Identifier {
  constructor(name) {
    this.name = name;
  }

  deps() {
    return [this.name];
  }
}

class Program {
  constructor(stmts = []) {
    this.stmts = stmts;
  }
}

class UnaryOp {
  constructor(op, value) {
    this.op = op;
    this.value = value;
  }
  deps() {
    return [this.value.deps().flat()];
  }
}

class BinaryOp {
  constructor(op, left, right) {
    this.op = op;
    this.left = left;
    this.right = right;
  }
  deps() {
    return [this.left.deps().flat(), this.right.deps().flat()];
  }
}

class Assignment {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  deps() {
    return [this.value.deps().flat()];
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    if (this.isAtEnd()) return this.tokens[this.tokens.length - 1];
    return this.tokens[this.current];
  }

  advance() {
    const curr = this.peek();
    this.current++;
    return curr;
  }

  prevToken() {
    return this.tokens[this.current - 1];
  }

  match(...expectedTypes) {
    for (let type of expectedTypes) {
      if (type == this.peek().type) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  isAtEnd() {
    return this.current >= this.tokens.length;
  }

  parse() {
    return this.program();
  }

  program() {
    const stmts = [];
    while (!this.isAtEnd() && this.peek().type != TOKEN_TYPE.EOF) {
      stmts.push(this.assignement());
    }
    return new Program(stmts);
  }

  assignement() {
    const left = this.binary();
    if (this.match(TOKEN_TYPE.ARROW)) {
      const right = this.binary();
      return new Assignment(right, left);
    }
    return left;
  }

  binary() {
    let left = this.unary();
    while (
      this.match(
        TOKEN_TYPE.AND,
        TOKEN_TYPE.OR,
        TOKEN_TYPE.RSHIFT,
        TOKEN_TYPE.LSHIFT
      )
    ) {
      const op = this.prevToken().value;
      const right = this.unary();
      left = new BinaryOp(op, left, right);
    }
    return left;
  }

  unary() {
    if (this.match(TOKEN_TYPE.NOT)) {
      let op = this.prevToken().value;
      let right = this.unary();
      return new UnaryOp(op, right);
    }
    return this.primary();
  }

  primary() {
    if (this.match(TOKEN_TYPE.NUMBER)) {
      return new Integer(Number(this.prevToken().value));
    }
    if (this.match(TOKEN_TYPE.IDENTIFIER))
      return new Identifier(this.prevToken().value);
    throw new Error(`Invalid token ${this.peek().value}`);
  }
}

class Environment {
  constructor() {
    this.env = {};
  }

  bind(name, value) {
    let val = new Uint16Array(1);
    val[0] = value;
    this.env[name] = val;
  }

  get(name) {
    const value = this.env[name];
    if (!value) throw new Error("error");
    return value[0];
  }
}

function buildGraph(stmts) {
  const graph = {};
  for (let stmt of stmts) {
    if (stmt instanceof Assignment) {
      const { value, name } = stmt;
      graph[name.name] = { node: stmt, deps: stmt.deps().flat() };
    }
  }
  return graph;
}

function sortGraph(stmts) {
  const graph = buildGraph(stmts);
  const visited = new Set();
  const inDegree = new Map();
  const queue = [];
  const sortedList = [];

  // count number of deps
  for (let [name, value] of Object.entries(graph)) {
    inDegree.set(name, value.deps.length);
  }

  // queue nodes with 0 deps
  inDegree.forEach((len, key) => {
    if (len == 0) {
      queue.unshift(key);
    }
  });

  while (queue.length) {
    const key = queue.pop();
    if (visited.has(key)) continue;
    visited.add(key);
    sortedList.push(graph[key].node);
    for (let [name, value] of Object.entries(graph)) {
      if (visited.has(name)) {
        continue;
      }
      if (value.deps.includes(key)) {
        inDegree.set(name, inDegree.get(name) - 1);
      }
      if (inDegree.get(name) == 0) {
        queue.unshift(name);
      }
    }
  }
  return sortedList;
}

class Interpreter {
  constructor() {
    this.env = new Environment();
  }

  interpret(node) {
    if (node instanceof Integer) return node.value;
    if (node instanceof Identifier) return this.env.get(node.name);
    if (node instanceof Program) return this.program(node);
    if (node instanceof BinaryOp) return this.binaryOp(node);
    if (node instanceof UnaryOp) return this.unaryOp(node);
    if (node instanceof Assignment) return this.assgn(node);
  }

  unaryOp(node) {
    const value = this.interpret(node.value);
    const fun = callback[node.op];
    return fun(value);
  }

  assgn(node) {
    const { name, value } = node;
    const left = this.interpret(value);
    this.env.bind(name.name, left);
  }

  binaryOp(node) {
    const left = this.interpret(node.left);
    const right = this.interpret(node.right);
    const fun = callback[node.op];
    return fun(left, right);
  }

  program(node) {
    for (let stmt of node.stmts) {
      this.interpret(stmt);
    }
  }
}

const input = fs.readFileSync("input", "utf-8");
const tokenizer = new Tokenizer(input);
const token = tokenizer.tokenize();
const parser = new Parser(token);
const ast = parser.parse();
ast.stmts = sortGraph(ast.stmts);
const interpreter = new Interpreter();
interpreter.interpret(ast);
console.log("a", interpreter.env.get("a"));
