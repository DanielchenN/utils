const PromiseExecute = require('./execute.js')
class PromisePool {
  //new PromisePool({ concurrency?, items? }) constructor
  constructor(poolSize, items) {
    this._poolSize = poolSize
    this._items = items
  }
  for(items) {
    this._items = items
    return this
  }
  limit(amount) {
    this._poolSize = amount
    return this
  }
  process(cb) {
    return new PromiseExecute({
      poolSize: this._poolSize,
      items: this._items,
      cb
    }).process(cb)
  }
}

module.exports = PromisePool