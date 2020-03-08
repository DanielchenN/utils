const pLimit = require('./index')

const timeout = function(delay) {
  return new Promise(res => {
    setTimeout(() => {
      res(delay)
    }, delay);
  })
}

const limit = pLimit(2)
const pArray = [
  limit(() => timeout(3000)),
  limit(() => timeout(200)),
  limit(() => timeout(100)),
]

;(async function() {
  const res = await Promise.all(pArray)
  console.log('res', res)
})()
