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
        parseValue()
        first = false

      }


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

  function comma() {
    if (str[i] !== ',') {
      throw new Error(`position ${i} Expected to be :`)
    }
  }

}