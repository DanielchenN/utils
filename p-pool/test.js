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
  { name: 'a' },
  { name: 'b' },
  { name: 'c' },
  { name: 'd' }
]

const fn = async function() {
  const { results, errors } = await new PromisePool()
  .for(users)
  .limit(2)
  .process(async (data, index) => {
    const user = await timeout((index + 1) * 1000)
    console.log('user', user)
    return user
  })
}

fn()
