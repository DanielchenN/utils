const mergeStream = require('../index')
const fs = require('fs')

const f1 = fs.createReadStream('./111')
const f2 = fs.createReadStream('./222')
// f1.emit('end')
f2.push(null)
const f3 = fs.createReadStream('./333')
const ret = mergeStream(f1, f2)

ret.add(f3)

ret.on('end', () => {
  console.log('123')
})

ret.pipe(fs.createWriteStream('./ttttt'))
