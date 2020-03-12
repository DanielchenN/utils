// https://www.json.org/json-en.html json的格式

// { ->  w ->  }
//{ -> w -> string -> w -> : -> value -> }
// { -> w -> string -> w -> : -> value -> , -> w -> string -> 循环}

const parser = function(str) {
  let i = 0
  const parseObject = function(str) {
    if (str[i] === '{') {
      i ++
      skipWhiteSpace()

      let first = true
      const result = {}

      while(str[i] !== '}') {

        if(!first) {
          skipComma()
          skipWhitespace()
        }

        const key = parseString()
        skipWhiteSpace()
        skipColon()
        const value = parseValue()
        result[key] = value
        first = false

      }
    }
  }

  function parseArray () {

    if (str[i]= '[') {
      let first = true
      const result = []
      skipWhiteSpace()
      while (str[i] !== ']') {
        if(!first) {
          skipComma()
        }
        const res = parseValue()
        result.push(res)
      }
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
      while (str[i] === '"' && i < str.length ) {
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

  function skipWhiteSpace() {
    while (str[i] === ' ' || str[i] === '\t' || str[i] === '\r' || str[i] === '\n') {
      i++
    }
  }

  function skipColon() {
    if (str[i] !== ':') {
      throw new Error(`position ${i} Expected to be :`)
    }
  }

  function skipComma() {
    if (str[i] !== ',') {
      throw new Error(`position ${i} Expected to be :`)
    }
  }

}