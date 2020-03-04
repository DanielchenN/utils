const { PassThrough } = require('stream')

module.exports = (...streams) => {
  const ret = new PassThrough({ objectMode: true })

  let waiting = streams.length

  ret.add = add

  streams.forEach(add)

  function add(stream) {
    // 将 chunk 作为 null 传递信号表示流的末尾（EOF） end: false 是这个服务的
    stream.pipe(ret, {end :false})
    stream.once('end', () => {
      waiting--
      if(waiting===0) {
        ret.emit('end')
      }
    })
  }
  return ret
}