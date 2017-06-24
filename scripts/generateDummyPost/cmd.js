require('babel-register')

const u = require('./index.js')

const targetDir = process.argv[2]
const imageDir = process.argv[3]

const options = {
    targetDir,
    imageDir,
}

for (let k = 40; k--; ) u.generatePost(options)
