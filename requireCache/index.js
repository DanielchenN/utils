const fs = require('fs')
const a = require('./a')
console.log('a', a )
// console.log(require.cache['/Users/chen/chen/porject/hot-loader/a.js'])

delete require.cache
// console.log(require.main)
delete require.main

// require.cache['/Users/chen/chen/porject/hot-loader/a.js'].exports.a ='b'
// fs.unlinkSync('./hot-loader/a.js')
const b = require('./a')
console.log('b',b)
// setTimeout(function() {

//   console.log(require.cache['/Users/chen/chen/porject/hot-loader/a.js'])
// }, 1000)



console.log('require', require.cache)
