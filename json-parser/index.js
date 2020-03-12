// https://www.json.org/json-en.html json的格式

// { ->  w ->  }
//{ -> w -> string -> w -> : -> value -> }
// { -> w -> string -> w -> : -> value -> , -> w -> string -> 循环}

const parser = function(str) {
  let i = 0

  const value = parseValue()

  return value

  function parseObject() {
    if (str[i] === '{') {
      i ++
      skipWhiteSpace()

      let first = true
      const result = {}

      while(str[i] !== '}') {

        if(!first) {
          skipComma()
          skipWhiteSpace()
        }

        const key = parseString()
        skipWhiteSpace()
        skipColon()
        const value = parseValue()
        result[key] = value
        first = false

      }
     return result

    }
  }

  function parseArray () {

    if (str[i]= '[') {
      i++
      let first = true
      const result = []
      skipWhiteSpace()
      while (i < str.length && str[i] !== ']') {
        if(!first) {
          skipComma()
        }
        first = false
        const res = parseValue()
        result.push(res)
      }
      i ++
      return result
    }
  } 

  function parseValue() {
    skipWhiteSpace()
    const value = parseString() || parseNumber() || parseObject() || parseArray() || parseKeyword('true', true) ||
    parseKeyword('false', false) || parseKeyword('null', null)
    skipWhiteSpace()
    return value
  }

  function parseString() {
    if(str[i] === '"') {
      i++
      let result = ""
      while (str[i] !== '"' && i < str.length ) {
        // 要吞掉第一个转义
        if(str[i] === '\\') {
          const char = str[i + 1];
          if ( 
              char === '"' ||
              char === "\\" ||
              char === "/" ||
              char === "b" ||
              char === "f" ||
              char === "n" ||
              char === "r" ||
              char === "t"
              ) 
              {
                result += char
                i++
          } else if (char ==='u') {
            // @TODO: unicode
          } else {

          }
        } else {
          result += str[i]
        }
        i++

      }
    i++
    return result
    }

  }

  function parseNumber() {
    let start = i
    if(str[i] === '0') {
      i++
    } else if(str[i] >= "1" && str[i] <= "9") {
      i++
      while(str[i] >= "0" && str[i] <= "9") {
        i++
      }
    }

    if(str[i] === '.') {
      i++
      // @TODO: error hanle
      while (str[i] >= "0" && str[i] <= "9") {
        i++
      }
    }

    if (i > start) {
      return Number(str.slice(start, i));
    }
  }


  function parseKeyword(name, value) {
    if (str.slice(i, i + name.length) === name) {
      i += name.length;
      return value;
    }
  }


  function skipWhiteSpace() {
    while (str[i] === ' ' || str[i] === '\t' || str[i] === '\r' || str[i] === '\n') {
      i++
    }
  }

  function skipColon() {
    if (str[i] !== ':') {
      throw new Error(`position ${i} Expected to be :`)
    }
    i++
  }

  function skipComma() {
    if (str[i] !== ',') {
      throw new Error(`position ${i} Expected to be :`)
    }
    i++
  }

}

var a = parser('{"a": "123", "chidren": "{}"}')
console.log('a', a)