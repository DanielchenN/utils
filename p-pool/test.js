const PromisePool = require('./index')

const timeout = function(delay) {
  return new Promise(res => {
    setTimeout(() => {
      res(delay)
      return delay
    }, delay);
  })
}

const users = [
  { delay: 1000 },
  { delay: 5000 },
  { delay: 1000 },
  { delay: 2000 }
]


const fn = async function() {
  const { results } = await new PromisePool()
  .for(users)
  .limit(2)
  .process(async (data, index) => {
    const user = await timeout(data.delay)
    console.log('out1', user)
    return user
  })
}

fn()

let n = -1
// 对比 一般的写法
Array(2).fill(0).map(async (item, index) => {
  while(n < users.length -1 ) {
    n++
    const res = await timeout(users[n].delay)
    console.log('out2', res)
  }
})


