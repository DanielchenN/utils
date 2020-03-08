const pLimit = (concurency = 1) => {

  let active = 0
  const queue = []

  const pTry = function(fn, ...arg) {
    return new Promise(resolve => {
      resolve(fn(...arg))
    })
  }

  const next = function() {
    active --
    if(queue.length) {
      queue.shift()()
    }
  }

  const run = function(fn, resolve, ...arg) {
    active ++ 
    // 防止非pormise函数没有then的情况
    const res = pTry(fn, ...arg)
    // const res = fn(...arg)
    resolve(res)

    res.then(next, next)
  }

  const execute = function(fn, resolve, ...arg) {
    if (active < concurency) {
      run(fn, ...arg, resolve)
    } else {
      queue.push(run.bind(null, fn, resolve, ...arg))
    }
  }

  const enqueue = function(fn, ...arg) {
    return new Promise(resolve => {
      execute(fn, resolve, ...arg)
    })
  }

  return enqueue
} 

module.exports = pLimit