### 
一般简单的可以写作Array(n).fill(0).map(async() => await someAsync()) 的方式来进行pool控制
这次 写个特（复）别（杂）的 (index & execute)
用法

```
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
```