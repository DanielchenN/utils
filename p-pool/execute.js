const EventEmitter = require('events');
class PromiseExecute extends EventEmitter {
  constructor ( {poolSize = 10, items =[]} ) {
    super()
    this.poolSize = poolSize
    this.items = items
    this.active = 0
    this.waiting = []
    this.result = []
    this.mapCount = -1
  }

  shouldWaiting () {
    return this.active >= this.poolSize
  }

  isAllFinished() {
    return !this.hasActive() && !this.waiting.length
  }

  hasActive() {
    return this.active > 0
  }

  async addQueue() {
    return new Promise(resolve => {
      this.waiting.push(resolve)
    })
  }

  async next() {
    this.active --
    if (this.waiting.length) {
      const resolve = this.waiting.shift()
      await resolve()
    }
    if(this.isAllFinished()) {
      this.emit('finish')
    }
  }

  async execute(cb, item, count){
    this.active ++
    this.result.push(
      await cb(item, count)
    )
    // 一个执行完了，需要接入另一个
    this.next()
  } 

  async process (cb) {
    for (let item of this.items) {
      this.mapCount++
      if (this.shouldWaiting()) {
        // pending queue
        await this.addQueue()
      }
      this.execute(cb, item, this.mapCount)
    }
    return this.end()
  }

  async end() {
    if(this.hasActive()) {
      // 这里有点烦，上面的实际上是移步的，这里需要等最后一个结束。可以传入一个promise但是，传递太多。
      await new Promise(resolve => {
        // 有意思的操作，可以通过发布订阅
        this.once('finish', resolve)
      })
    }
    return {
      result: this.result
    }
  }

}

module.exports = PromiseExecute