require('babel-register')
const u = require('./index')

console.log(JSON.stringify(u.readPosts({ postDir: process.argv[2] })))
