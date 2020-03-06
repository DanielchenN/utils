class PromiseExecute {s
  constructor(poolSize = 10, items =[]) {
    this.poolSize = poolSize
    this.items = items
    this.active = 0
    this.waiting = []
    this.result = []
  }

  shouldPending () {
    return this.active >= this.poolSize
  }

  isEnd() {

  }

  async addQueue() {
    return new Promise(resolve => {
      this.pending.push(resolve)
    })
  }

  async next() {
    this.active --
    if (this.waiting.length) {
      const resolve = this.waiting.shift()
      await resolve()
    }
  }

  async execute(cb, item){
    this.active ++
    this.result.push(
      await cb(item)
    )
    // 一个执行完了，需要接入另一个
    this.next()
  } 

  async process (cb) {
    for (let item of this.items) {
      if (this.shouldPending()) {
        // @TODO: pending
        await this.addQueue()
      }
      this.execute(cb, item)
    }
    return this.end()
  }

  async end() {
    if(!this.isEnded()) {
      // 这里有点烦，上面的实际上是移步的，这里需要等最后一个结束。可以传入一个promise但是，传递太多。
    }
    return {
      result: this.result
    }
  }

}

module.exports = PromiseExecute