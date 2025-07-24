const TOKEN_TYPE = {
  LPARENT: "LPARENT",
  RPARENT: "RPARENT",
  LBRACKET: "LBRACKET",
  RBRACKET: "RBRACKET",
  NUMBER: "NUMBER",
  STRING: "STRING",
  COLON: "COLON",
  MINUS: "MINUS",
  COMMA: "COMMA",
  EOF: "EOF",
};

class JSON {
  static parse(source) {
    const tokens = JSON.tokens(source);
    const parser = new JsonParser(tokens);
    const gen = JsonGen.generate(parser.parse());
    return gen;
  }
  static tokens(source) {
    const tokenizer = new JsonTokenizer(source);
    const tokens = tokenizer.tokenize();
    return tokens;
  }
}

class Token {
  constructor(value, type) {
    this.value = value;
    this.type = type;
  }
}

class JsonTokenizer {
  constructor(source) {
    this.source = source;
    this.curr = 0;
    this.start = 0;
    this.tokens = [];
  }

  tokenize() {
    while (!this.isEOF()) {
      this.start = this.curr;
      this.nextToken();
    }
    this.addToken(TOKEN_TYPE.EOF, "");
    return this.tokens;
  }

  nextToken() {
    const c = this.advance();

    if (this.isWhitespace(c)) return null;

    switch (c) {
      case "{":
        return this.addToken(TOKEN_TYPE.LBRACKET);
      case "}":
        return this.addToken(TOKEN_TYPE.RBRACKET);
      case "[":
        return this.addToken(TOKEN_TYPE.LPARENT);
      case "]":
        return this.addToken(TOKEN_TYPE.RPARENT);
      case ":":
        return this.addToken(TOKEN_TYPE.COLON);
      case ",":
        return this.addToken(TOKEN_TYPE.COMMA);
    }

    if (c == '"') return this.string();
    if (this.isNumber(c) || c == "-") return this.number();
  }

  number() {
    while (!this.isEOF() && this.isNumber(this.peek())) this.advance();
    if (this.isEOF()) throw new Error(`expetcted '"', found EOF`);
    this.addToken(TOKEN_TYPE.NUMBER);
  }

  string() {
    while (!this.isEOF() && this.peek() != '"') this.advance();
    if (this.isEOF()) throw new Error(`expetcted '"', found EOF`);
    this.advance();
    this.addToken(
      TOKEN_TYPE.STRING,
      this.source.substring(this.start + 1, this.curr - 1)
    );
  }

  isWhitespace(c) {
    return /\s+/.test(c);
  }

  isNumber(c) {
    return /\d+/.test(c);
  }

  addToken(type, value) {
    if (value == undefined) {
      value = this.source.substring(this.start, this.curr);
    }
    const token = new Token(value, type);
    this.tokens.push(token);
  }

  isEOF() {
    return this.curr >= this.source.length;
  }

  peek() {
    if (this.isEOF()) return "\0";

    return this.source[this.curr];
  }

  match(expcted) {
    if (expcted != this.peek()) return false;
    this.advance();
    return true;
  }

  advance() {
    if (this.isEOF()) return "\0";
    const res = this.peek();
    this.curr++;
    return res;
  }
}

class JsonDocument {
  constructor(body) {
    this.body = body;
  }
}

class String {
  constructor(value) {
    this.value = value;
  }
}

class Integer {
  constructor(value) {
    this.value = value;
  }
}

class Obj {
  constructor(body) {
    this.body = body;
  }
}

class Arr {
  constructor(body) {
    this.body = body;
  }
}

class KeyValue {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
}

class JsonParser {
  constructor(tokens) {
    this.tokens = tokens;
    this.curr = 0;
  }

  parse() {
    return this.jsonDocument();
  }

  peek() {
    if (this.curr >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.curr];
  }

  advance() {
    if (this.curr >= this.tokens.length) {
      return this.tokens[this.tokens.length - 1];
    }
    return this.tokens[this.curr++];
  }

  match(...types) {
    for (let type of types) {
      if (this.peek().type == type) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  isMatch(...types) {
    for (let type of types) {
      if (this.peek().type == type) {
        return true;
      }
    }
    return false;
  }

  consume(...types) {
    if (!this.isMatch(...types)) {
      throw new Error(
        `Expected one of ${types.join(", ")}, found ${this.peek().type}`
      );
    }
    return this.advance();
  }

  jsonDocument() {
    const body = [];
    while (!this.isMatch(TOKEN_TYPE.EOF)) {
      if (this.match(TOKEN_TYPE.COMMA)) continue;
      const value = this.primary();
      body.push(value);
    }
    this.consume(TOKEN_TYPE.EOF);
    if (body.length == 0) {
      throw new Error("JSON document cannot be empty");
    }
    return new JsonDocument(body);
  }

  obj() {
    const body = [];
    while (!this.isMatch(TOKEN_TYPE.RBRACKET)) {
      if (this.match(TOKEN_TYPE.COMMA)) continue;
      body.push(this.keyValue());
    }
    this.consume(TOKEN_TYPE.RBRACKET);
    return new Obj(body);
  }

  keyValue() {
    const key = this.primary();
    if (key instanceof String === false) {
      throw new Error(`Expected a string key, found ${key.type}`);
    }
    this.consume(TOKEN_TYPE.COLON);
    const value = this.primary();
    return new KeyValue(key, value);
  }

  array() {
    const body = [];
    while (!this.isMatch(TOKEN_TYPE.RPARENT)) {
      if (this.match(TOKEN_TYPE.COMMA)) continue;
      const value = this.primary();
      body.push(value);
    }
    this.consume(TOKEN_TYPE.RPARENT);
    return new Arr(body);
  }

  primary() {
    if (this.isMatch(TOKEN_TYPE.STRING)) {
      return new String(this.advance().value);
    } else if (this.isMatch(TOKEN_TYPE.NUMBER)) {
      return new Integer(Number(this.advance().value));
    } else if (this.match(TOKEN_TYPE.LBRACKET)) {
      return this.obj();
    } else if (this.match(TOKEN_TYPE.LPARENT)) {
      return this.array();
    }
    throw new Error(`Unexpected token: ${this.peek().type}`);
  }
}

class JsonGen {
  constructor(ast) {
    this.ast = ast;
  }

  generate() {
    return this.jsonDocument(this.ast);
  }
   // generate js object from AST
  static generate(ast) {
    if (ast instanceof JsonDocument) {
      return ast.body.map((item) => JsonGen.generate(item))[0];
    } else if (ast instanceof Obj) {
      const obj = {};
      for (const kv of ast.body) {
        obj[kv.key.value] = JsonGen.generate(kv.value);
      }
      return obj;
    } else if (ast instanceof Arr) {
      return ast.body.map((item) => JsonGen.generate(item));
    } else if (ast instanceof String) {
      return ast.value;
    } else if (ast instanceof Integer) {
      return ast.value;
    }
    throw new Error(`Unknown AST node type: ${ast.constructor.name}`);
  }
}

module.exports = JSON;
